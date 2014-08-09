/*jshint loopfunc: true */
define(['messages', 'utilities'], function(messages, utilities) {

  return function VMExport() {

    var _this = this;
    var _students = [];
    this.exportText = ko.observable('');
    var QUOTE = '"';

    messages.subscribe('data.students', function(data) {
      if (data.array) {
        _students = data.array.slice();
        _students.sort(function(a, b) {
          return (a.lastName + a.firstName < b.lastName + b.firstName) ? -1 :
            (a.lastName + a.firstName > b.lastName + b.firstName) ? 1 : 0;
        });
      }
    });

    this.studentsExport = function() {
      _this.exportText('');
      var _ignoreFieldsOnExport = ['contacts', 'contactEmails', 'notes'];
      var len = _students.length;
      var headers = '';
      for (var i = 0; i < len; i++) {
        var line = '';
        $.each(_students[i], function(name, field) {
          if ((typeof(field) === 'string') && ($.inArray(name, _ignoreFieldsOnExport) === -1)) {
            if (i === 0) {
              if (headers === '') {
                headers = name;
              } else {
                headers += ',' + name;
              }
            }
            field.replace(/"/g, "'");
            if (line === '') {
              line += QUOTE + field + QUOTE;
            } else {
              line += ',' + QUOTE + field + QUOTE;
            }
          }
        });
        _this.exportText(_this.exportText() + line + "\n");
      }
      _this.exportText(headers + "\n" + _this.exportText());
    };

    this.contactsExport = function() {
      _this.exportText('');
      var len = _students.length;
      var line = '"studentId","lastName","firstName","name","phone","relationship","type"' + "\n";
      for (var i = 0; i < len; i++) {
        if (_students[i].contacts && (_students[i].contacts.length > 0)) {
          var student = _students[i];
          var cLen = _students[i].contacts.length;
          for (var j = 0; j < cLen; j++) {
            var c = _students[i].contacts[j];
            line += QUOTE + student.studentId + QUOTE + ',' + QUOTE + student.lastName + QUOTE + ',' + QUOTE + student.firstName + QUOTE + ',';
            line += QUOTE + c.name.replace(/"/g, "'") + QUOTE + ',' + QUOTE + c.phone.replace(/"/g, "'") + QUOTE + ',' + QUOTE + c.relationship.replace(/"/g, "'") + QUOTE + ',' + QUOTE + c.type.replace(/"/g, "'") + QUOTE + "\n";
          }
        }
      }
      _this.exportText(line);
    };

    this.contactEmailsExport = function() {
      _this.exportText('');
      var len = _students.length;
      var line = '"studentId","lastName","firstName","contactEmails"' + "\n";
      for (var i = 0; i < len; i++) {
        if (_students[i].contactEmails && (_students[i].contactEmails.length > 0)) {
          var student = _students[i];
          var eLen = student.contactEmails.length;
          var emails = '';
          for (var j = 0; j < eLen; j++) {
            if (emails === '') {
              emails += student.contactEmails[j].email;
            } else {
              emails += ', ' + student.contactEmails[j].email;
            }
          }
          line += QUOTE + student.studentId + QUOTE + ',' + QUOTE + student.lastName + QUOTE + ',' + QUOTE + student.firstName + QUOTE + ',';
          line += QUOTE + emails + QUOTE+"\n";
        }
      }
      _this.exportText(line);
    };

  };
});