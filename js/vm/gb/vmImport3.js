/*jshint loopfunc: true */
define(['messages', 'utilities', 'models'], function(messages, utilities, models) {

  return function VMImport3() {

    var _this = this;
    var _students = {
      object: {},
      array: [],
      index: []
    };

    var _classes = {
      object: {},
      periodIndex: []
    };
    var _classesChanged = false;

    this.visible = ko.observable(false);
    this.importStatus = ko.observable('');

    messages.subscribe('import.wizard.to.step.3', function(payload) {
      _this.visible(true);
      _process(payload.data, payload.fields, payload.ignoreCol1);
      if (_classesChanged) {
        messages.publish('data', {
          request: 'update',
          dataType: 'gradebook',
          keys: ['classes'],
          returnMsg: 'import.update.class.complete',
          data: _classes.object
        });
      }
    });

    messages.subscribe('data.students', function(data) {
      if (data.object) {
        _students = {
          object: data.object,
          array: data.array,
          index: _createIndex(data.array),
        };
      }
    });

    messages.subscribe('data.classes', function (data) {
      if (data.object) {
        _classes = {
          object: data.object,
          periodIndex: _createClassIndex(data.array)
        };
      }
    });

    messages.subscribe('data.import.complete', function() {
      _this.importStatus(_this.importStatus()+"\n"+'Import completed!');
    });

    _createIndex = function(data) {
      var index = {};
      if (data && (data.length > 0)) {
        var len = data.length;
        for (var i = 0; i < len; i++) {
          index[data[i].studentId] = data[i]._key;
        }
      }
      return index;
    };

    _createClassIndex = function(data) {
      var index = {};
      if (data && (data.length > 0)) {
        var len = data.length;
        for (var i=0; i < len; i++) {
          index[data[i].period] = data[i]._key;
        }
      }
      return index;
    };

    _process = function(data, fields, ignoreCol1) {
      _this.importStatus('Import in process...');

      // Scan through imported items and create a new
      // object that we'll send to Firebase to update students
      var newItems = _loadData(data, fields, ignoreCol1);
      var len = newItems.length;
      for (var i = 0; i < len; i++) {
        // Get student key into Firebase data
        var key = _students.index[newItems[i].student.studentId];
        // Merge updates with existing student record or create a new record
        var existingItem = (key) ? _students.object[key] : models.newModel('MStudent');
        itemToUpdate = $.extend(existingItem, newItems[i].student);
        // Update contacts
        var newContact = $.extend(models.newModel('MContact'), newItems[i].contact);
        itemToUpdate.contacts = _updateContacts(itemToUpdate.contacts, newContact);
        // Update contact emails
        itemToUpdate.contactEmails = _updateContactEmails(itemToUpdate.contactEmails, newItems[i].email);
        // Update enrollment -- Student key will be added only.
        // No students will be unenrolled
        var msg = (i+1 === len) ? 'import.complete' : 'import.continuing';
        if (newItems[i].period) {
          var thisClass = _classes.object[_classes.periodIndex[newItems[i].period]];
          if (thisClass.enrollment.indexOf(key) === -1) {
            var arr = thisClass.enrollment.split('.');
            arr.push(key);
            thisClass.enrollment = arr.join('.');
            _classesChanged = true;
          }
        }
        if (key) {
          messages.publish('data', {
            request: 'update',
            dataType: 'gradebook',
            keys: ['students', key],
            returnMsg: msg,
            data: itemToUpdate
          });
        } else {
          messages.publish('data', {
            request: 'push',
            dataType: 'gradebook',
            keys: ['students'],
            returnMsg: msg,
            data: itemToUpdate
          });
        }
      }
    };

    _updateContacts = function(existingContacts, newContact) {
      var dupe = false;
      for (var j = 0; j < existingContacts.length; j++) {
        dupe = dupe || Object.equals(newContact, existingContacts[j]);
      }
      if (!dupe) {
        existingContacts.push(newContact);
      }
      return existingContacts;
    };

    _updateContactEmails = function(existingEmails, newEmail) {
      var json = JSON.stringify(existingEmails);
      var i = 0;
      while (i < newEmail.length) {
        if (json.indexOf(newEmail[i]) !== -1) {
          newEmail.splice(i, 1);
        } else {
          existingEmails.push({
            email: newEmail[i]
          });
          i++;
        }
      }
      return existingEmails;
    };

    _loadData = function(data, fields, ignoreCol1) {
      var newItems = [];
      if (data.length > 0) {
        $.each(data, function(i, item) {
          if ((i > 0) || !ignoreCol1) {
            // Imported data will be placed here
            var newItem = {
              student: {},
              contact: {},
              email: [],
              period: undefined
            };

            // Load data fields
            $.each(fields, function(j, field) {
              if (field !== '') {
                var fieldArr = field.split(':');
                switch (fieldArr[0]) {
                  case 'Student':
                    if (fieldArr[1] === 'avid' || fieldArr[1] === 'inactive') {
                      item[j] = utilities.convertIntToBoolean(item[j]);
                    }
                    newItem.student[fieldArr[1]] = item[j];
                    break;
                  case 'Contact':
                    newItem.contact[fieldArr[1]] = item[j];
                    break;
                  case 'Contact email':
                    newItem.email.push(item[j]);
                    break;
                  case 'Enrollment':
                    newItem.period = item[j];
                    break;
                }
              }
            });
            newItems.push(newItem);
          }
        });
      }
      return newItems;
    };

    this.finish = function() {
      _this.visible(false);
      messages.publish('import.wizard.to.step.1');
    };

  };
});