define(['utilities', 'messages', 'progressReport', 'svc/svcPRUtilities'], function (utilities, messages, svcProgressReport, svcPRUtilities) {

  return function VMProgressReport() {

    var _this = this;

    this.progressReport = ko.observable('');
    this.student = ko.observable();
    this.student.subscribe(function (newStudent) {
    });
    this.emailStudent = ko.observable(true);
    this.emailContacts = ko.observable(false);
    this.classList = ko.observableArray([]);
    this.selectedClass = ko.observableArray('');
    this.selectedClass.subscribe(function(newClass) {
      _createProgressReport();
    });
    this.classes = {};
    var _user;

    messages.subscribe('data.student', function (data) {
      _this.student(data.object);
      _getClassListForStudent();
    });
    messages.subscribe('data.classes', function (data) {
      _this.classes = data.object;
    });
    messages.subscribe('control.login', function (data) {
      _user = data.firebase.user;
    });

    _getClassListForStudent = function () {
      _this.classList([]);
      var key = _this.student()._key;
      var list = [];
      if (_this.classes && (key.length>0)) {
        $.each(_this.classes, function (classKey, aClass) {
          if ((classKey !== '_key') && aClass.enrollment.indexOf(key) >= 0) {
            list.push({
              name: aClass.name+' (Per '+aClass.period+')',
              key: classKey,
              period: aClass.period
            });
          }
        });
        list.sort(utilities.sortByPeriod);
      }
      _this.classList(list);
    };

    _createProgressReport = function() {
      if (_this.student() && _this.selectedClass()) {
        _this.progressReport(svcProgressReport.createHTML(_this.student()._key, _this.selectedClass()).html);
      } else {
        _this.progressReport('');
      }
    };

    _createProgressReportText = function() {
      return svcProgressReport.createText(_this.student()._key, _this.selectedClass());
    };

    this.caption = function() {
      return utilities.getName(ko.toJS(_this.student));
    };

    this.sendEmail = function () {
      var prMsg = _createProgressReportText();
      var name = _this.student().firstName+' '+_this.student().lastName;
      var thisClass = _this.classes[_this.selectedClass()];
      var subject = svcPRUtilities.getSubject(_this.student(), _this.classes[_this.selectedClass()]);
      var emails = '';
      if (_this.emailStudent()) {
        emails = _this.student().email;
      }
      if (_this.emailContacts()) {
        for (var i=0; i<_this.student().contactEmails.length; i++) {
          if (emails.length !== 0) {
            emails += ', ';
          }
          emails += _this.student().contactEmails[i].email;
        }
      }
      $.ajax({
        url: 'php/sendEmail.php',
        context: this,
        type: 'post',
        data: {
          message: prMsg.text,
          emails: emails,
          subject: subject,
          from: _user.email
        },
        dataType: 'json',
        success: function(data, string) {
          if (data.error) {
            bootbox.alert('There was a problem sending the email');
          } else {
            bootbox.alert('Email was sent');
          }
        },
        error: function (xhr, errType, obj) {
        }
      });

    };

    this.print = function () {
      $('.progress-report-text').clone().jqprint();
    };

  };

});
