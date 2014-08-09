define(['utilities', 'messages', 'models'], function(utilities, messages, models) {

  return function VMStudents() {

    var _this = this;
    var _editing = 0;

    this.filterText = ko.observable('');
    this.students = ko.observableArray([]);
    this.filteredStudents = ko.computed(function() {
      return utilities.filter(_this.students(), ['lastName', 'firstName', 'studentId', 'rfid', 'email'], _this.filterText(), false);
    }, this);
    this.selectedStudentKey = ko.observable('');
    this.selectedStudentKey.subscribe(function(key) {
      _editing = 0;
      messages.publish('view.studentSelected', {
        key: key
      });
    });

    // Student list loaded
    messages.subscribe('data.students', function(data) {
      _this.students(utilities.sortOnField(data.array, ['lastName', 'firstName']));
    });

    // New student was added
    messages.subscribe('data.pushStudent', function(data) {
      _this.selectedStudentKey(data.key);
    });

    // Listen for editing messages from VMs that edit students
    messages.subscribe('view.student.beginEdit', function(data) {
      _editing++;
    });
    messages.subscribe('view.student.endEdit', function(data) {
      _editing = Math.max(0, _editing - 1);
    });

    this.clearFilterText = function() {
      _this.filterText('');
    };

    // Editing in progress, confirm before selecting or adding another gradebook
    this.click = function(key) {
      if (_editing > 0) {
        bootbox.confirm('The changes to this student will be lost if you select another student.  Are you sure?', function(result) {
          if (result) {
            _editing = 0;
            _this.click(key);
          }
        });
      } else {
        _this.selectedStudentKey(key);
      }
    };

    this.add = function() {
      if (_editing > 0) {
        bootbox.confirm('The changes to this student will be lost if you add a student.  Are you sure?', function(result) {
          if (result) {
            _editing = 0;
            _this.add();
          }
        });
      } else {
        messages.publish('data', {
          request: 'push',
          dataType: 'gradebook',
          keys: ['students'],
          data: models.newModel('MStudent'),
          returnMsg: 'pushStudent'
        });
      }
    };

    this.del = function() {
      bootbox.confirm('Are you sure you want to delete this student? This cannot be undone', function(result) {
        if (result) {
          messages.publish('data', {
            request: 'remove',
            dataType: 'gradebook',
            keys: ['students', _this.selectedStudentKey()]
          });
        }
      });
    };

  };

});