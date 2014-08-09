/*jshint loopfunc: true */
define(['messages', 'utilities'], function (messages, utilities) {
  
  return function VMImport2() {

    var _this = this;

    this.visible = ko.observable(false);
    this.importData = ko.observable();
    this.importData.subscribe(function(newData) {
      _this.dataFragment(_parseToDisplay(newData));
    });
    this.allFieldList = ko.observable();
    this.ignoreCol1 = ko.observable(true);
    this.dataFragment = ko.observable();
    this.enableNext = ko.observable(false);
    this.studentIdErr = ko.observable(true);
    this.contactErr = ko.observable(false);

    messages.subscribe('import.wizard.to.step.2', function (payload) {
      _this.importData(payload.data);
      if (!_this.allFieldList()) {
        _this.allFieldList(_createFieldList());
      }
      _validate();
      _this.visible(true);
    });

    _createFieldList = function () {
      var STUDENT_FIELD_LIST = ['birthday','caseManager','cellPhone','city','classOf','counselor',
        'email','firstName','grade','lastName','middleName','nickname','notes',
        'parents','password','rfid','streetAddress','studentId','studentPhone','textbook','zip'];
      var CONTACT_FIELD_LIST = ['name','phone','relationship','type'];
      var CONTACT_EMAIL_FIELD_LIST = ['email'];
      var ENROLLMENT_PERIOD = ['period'];
      var fields = [
        {fieldListName: 'Student', fieldList: STUDENT_FIELD_LIST},
        {fieldListName: 'Enrollment', fieldList: ENROLLMENT_PERIOD},
        {fieldListName: 'Contact', fieldList: CONTACT_FIELD_LIST},
        {fieldListName: 'Contact email', fieldList: CONTACT_EMAIL_FIELD_LIST}
      ];
      var f = [];
      for (var i=0; i<fields.length; i++) {
        for (var j=0; j<fields[i].fieldList.length; j++) {
          f.push({fieldList: fields[i].fieldListName, fieldName: fields[i].fieldList[j]});
        }
      }
      return f;
    };

    _parseToDisplay = function (data) {
      var MAX_RECORDS_TO_SHOW = 4;
      var dataToDisplay = data.slice(0);

      // Truncate array to first 4 records
      if (dataToDisplay.length > MAX_RECORDS_TO_SHOW) {
        dataToDisplay.splice(MAX_RECORDS_TO_SHOW, dataToDisplay.length - MAX_RECORDS_TO_SHOW);
      }

      // Transpose rows and columns
      return utilities.transpose(dataToDisplay);
    };

    _validate = function () {
      return _validateStudentId() && _validateContact() && _validateEnrollment();
    };

    _validateStudentId = function () {
      var r = false;
      var fields = $('#vmImport2 select');
      $.each(fields, function (i, field) {
        if ($(field).val()) {
          r = r || ($(field).val().indexOf('studentId') >= 0);
        }
      });
      _this.studentIdErr(!r);
      return r;
    };

    _validateEnrollment = function () {
      var r = true;
      var found = false;
      var fields = $('#vmImport2 select');
      $.each(fields, function (i, field) {
        if ($(field).val().indexOf('period') >= 0) {
          if (found) {
            r = false;
          } else {
            found = true;
          }
        }
      });
      return r;
    };

    _validateContact = function () {
      var found = {
        'Contact:name': false,
        'Contact:relationship': false,
        'Contact:phone': false,
        'Contact:type': false
      };
      var fields = $('#vmImport2 select');
      var r = true;
      $.each(fields, function (i, field) {
        var v = $(field).val();
        if (r && (found[v] !== undefined)) {
          if (found[v] === false) {
            found[v] = true;
          } else {
            r = false;
          }
        }
      });
      _this.contactErr(!r);
      return r;
    };

    this.change = function () {
      _this.enableNext(_validate());
    };

    this.next = function () {
      _this.visible(false);
      var fields = [];
      var enrollmentField = false;
      $.each($('#vmImport2 select'), function (i, field) {
        if (!enrollmentField && (($(field).val()).indexOf('period') !== -1)) {
          enrollmentField = true;
        }
      });
      if (enrollmentField) {
        bootbox.confirm('Student information must already be in the gradebook to import enrollment information. Is this true?', function (result) {
          if (result) {
            $.each($('#vmImport2 select'), function (i, field) {
              fields.push($(field).val());
            });
            messages.publish('import.wizard.to.step.3', {data: _this.importData(), fields: fields, ignoreCol1: _this.ignoreCol1()});
          }
        });
      } else {
        $.each($('#vmImport2 select'), function (i, field) {
          fields.push($(field).val());
        });
        messages.publish('import.wizard.to.step.3', {data: _this.importData(), fields: fields, ignoreCol1: _this.ignoreCol1()});        
      }
    };

    this.cancel = function () {
      _this.visible(false);
      messages.publish('import.wizard.to.step.1');
    };

    this.optionsText = function (item) {
      return item.fieldList+': '+item.fieldName;
    };

    this.optionsValue = function (item) {
      return item.fieldList+':'+item.fieldName;
    };

  };
});
