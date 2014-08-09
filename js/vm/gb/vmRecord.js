define(['firebase', 'utilities', 'messages', 'models'],
  function (firebase, utilities, messages, models)  {
  
  return function vmRecord() {
    var _this = this;
    this.dirty = ko.observable(false);
    
    this.fillText = ko.observable('');
    
    // Category selected by vmAssignments
    this.categoryId = ko.observable('');
    this.categoryId.subscribe(function(newCategory) {
      _this.selectedAssignment('');    // Clear assignment when category changed
    });
    
    // Assignment selected by vmAssignments
    this.selectedAssignment = ko.observable('');
    this.selectedAssignment.subscribe(function(newAssignment) {
      messages.publish('data', {request: 'once', dataType: 'gradebook', keys: ['items'], priority: _this.selectedAssignment(), returnMsg: 'items'});

    });
    
    // Assignment items
    this.items = ko.observableArray([]);
    this.items.subscribe(function() {
      _matchAssignmentsWithStudents();
    });

    // All students
    this.students = ko.observableArray([]);
    
    // All classes
    this.classes = ko.observableArray([]);
    this.classes.subscribe(function() {
      _matchAssignmentsWithStudents();
    });

    // Classes that include the assignment's category - these will
    // be the buttons that will select the student
    this.classesForAssignment = ko.computed(function() {
      var __this = this;
      if (this.classes() && this.categoryId() && (this.classes().length > 0) && (this.categoryId().length > 0)) {
        return $.grep(this.classes(), function (aClass, i) {
          return (aClass.categories.indexOf(__this.categoryId()) >= 0);
        });
      } else {
        return [];
      }
    }, this);
    
    // List of students in the classesForAssignment
    this.studentRoster = ko.observableArray([]);
    this.studentRoster.subscribe(function() {
      _matchAssignmentsWithStudents();
    });
    
    this.recordItems = ko.observableArray([]);
    var _revert;
    
    // Assignment and category are selected in the vmAssignments viewmodel
    // Notify this vm of changes in assignment and category
    messages.subscribe('view.assignmentSelected', function(args) {
      _this.selectedAssignment(args.key);
    });
    
    messages.subscribe('view.assignment.newCategory', function(args) {
      _this.categoryId(args.newCategory);
    });

    messages.subscribe('data.classes', function(data) {
      var classArray = utilities.clone(data.array);
      if (classArray && (classArray.length>0)) {
        $.each(classArray, function(i, el) {
          el.selected = ko.observable(false);
        });
      }
      _this.classes(utilities.sortOnField(classArray, ['period','name']));
    });

    messages.subscribe('data.students', function(data) {
      var obj = {};
      if (data.array && (data.array.length>0)) {
        var arr = utilities.sortOnField(data.array, ['lastName','firstName']);
        $.each(arr, function(key, student) {
          obj[student._key] = utilities.clone(student);
        });
      }
      _this.students(obj);
    });

    messages.subscribe('data.items', function(data) {
      _this.items(_processAssignmentItems(data.array));
    });
    
    messages.subscribe('data.itemsSaved', function() {
      _this.dirty(false);
      messages.publish('view.assignments.endEdit');
    });

    // Sorting functions
    var _sortByName = function(a, b) {
      return a.student.lastName+a.student.firstName < b.student.lastName+b.student.firstName ? -1 :
        a.student.lastName+a.student.firstName > b.student.lastName+b.student.firstName ? 1 : 0;
    };
    
    var _sortClasses = function(arr) {
      return arr.sort(utilities.sortByPeriod);
    };
    
    // Add a selected flag and create an array of students enrolled in the class
    var _processClassItems = function(arr) {
      var len = arr.length;
      while(len--) {
        arr[len].selected = false;
        arr[len] = ko.mapping.fromJS(arr[len]);
        arr[len].students = arr[len].enrollment().split('.');
      }
      return arr;
    };
    
    // Process the class array
    var _processClasses = function(arr) {
      arr = _sortClasses(arr);
      arr = _processClassItems(arr);
      return arr;
    };
    
    // Create an object with item information keyed by student key
    var _processAssignmentItems = function(arr){
      var items = {};
      if (arr && (arr.length > 0)) {
        $.each(arr, function (i, item) {
          items[item.studentId] = item;
        });
      }
      return items;
    };
      
    // Create a list of students that are on the rosters of the selected classes
    var _updateStudentList = function () {
      var sArr = [];
      var cArr = ko.mapping.toJS(_this.classesForAssignment());
      var len = cArr.length;
      while (len--) {
        if (cArr[len].selected) {
          sArr = sArr.concat(cArr[len].enrollment.split('.'));
        }
      }
      _this.studentRoster(sArr);
    };
    
    // Match assignments with students to display
    var _matchAssignmentsWithStudents = function () {
      if (_this.studentRoster().length > 0) {
        var recordItemObjects = {};
        var recordItemArray = [];
        $.each(_this.studentRoster(), function (key, studentKey) {
          recordItemObjects[studentKey] = {student: _this.students()[studentKey]};
        });
        $.each(_this.items(), function (i, item) {
          if (recordItemObjects[item.studentId]) {
            recordItemObjects[item.studentId].item = ko.mapping.fromJS(item);
          }
        });
        $.each(recordItemObjects, function (i, recordItem) {
          if (!recordItem.item) {
            recordItem.item = ko.mapping.fromJS(models.newModel('MItem'));
            recordItem.item.studentId(recordItem.student._key);
            recordItem.item.assignmentId(_this.selectedAssignment());
          }
        });
        $.each(recordItemObjects, function(key, recordItem) {
          recordItemArray.push(recordItem);
        });
        var arr = recordItemArray.sort(_sortByName);
        _this.recordItems(arr);
        _revert = JSON.stringify(ko.mapping.toJS(arr));
      } else {
        _this.recordItems([]);
        _revert = JSON.stringify([]);
      }
    };

    var _validate = function() {
      return true;
    };
    
    this.fillClick = function() {
      $.each(_this.recordItems(), function(i, item) {
        var ft = _this.fillText();
        item.item.grade(ft);
      });
      _this.change();
    };
    
    this.toggleClass = function (aClass, el) {
      aClass.selected(!aClass.selected());
      _updateStudentList();
    };

    this.toggleClassesOff = function() {
      if (_this.classes && (_this.classes().length>0)) {
        $.each(_this.classes(), function(i, aClass) {
          aClass.selected(false);
        });
      }
    };
    
    this.saveClick = function () {
      if (_validate()) {
        var obj = {};
        // Save priority here so we can save to firebase all at once
        $.each(_this.recordItems(), function (i, item) {
          var thisItem = ko.mapping.toJS(item.item);
          thisItem['.priority'] = thisItem.assignmentId;
          obj[thisItem._key] = thisItem;
        });
        messages.publish('data', {request: 'update', dataType: 'gradebook', keys: ['items'], returnMsg: 'itemsSaved', data: obj});
      }
    };
    
    this.cancelClick = function () {
      var data = JSON.parse(_revert);
      $.each(data, function (i, it) {
        it.item = ko.mapping.fromJS(it.item);
      });
      _this.recordItems(data);
      messages.publish('view.assignments.endEdit');
      // messages.notify('vmRecord:endEdit');        
      _this.dirty(false);
    };
    
    this.change = function() {
      if (!_this.dirty()) {
        _this.dirty(true);
        messages.publish('view.assignments.beginEdit');
        // messages.notify('vmRecord:beginEdit');        
      }
    };

  };
});
