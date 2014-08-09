define(['messages', 'firebase', 'utilities'],
  function(messages, firebase, utilities) {

    return function VMStudentRfid() {

      var _this = this;

      this.rfid = ko.observable('');
      this.dirty = ko.observable(false);
      this.student = ko.observable();
      this.student.subscribe(function(newStudent) {
        _this.rfid(newStudent.rfid);
      });

      this.caption = ko.computed(function() {
        return 'Student: ' + utilities.getName(_this.student());
      }, _this);

      _rfidField = $('[name="rfid"]').focus(function() {
        this.select();
      });

      // $('[name="rfid"]').focus(function() {
      //   this.select();
      // });

      messages.subscribe('data.student', function(data) {
        _this.student(data.object);
        $('[name="rfid"]').focus();
      });
      messages.subscribe('data.student.rfid.saved', function(data) {
        _this.dirty(false);
        _this.rfid(_this.student().rfid);
        messages.publish('view.students.endEdit');
      });

      this.change = function() {
        if (!_this.dirty()) {
          messages.publish('view.students.beginEdit');
          _this.dirty(true);
        }
      };

      this.save = function() {
        messages.publish('data', {
          request: 'set',
          dataType: 'gradebook',
          keys: ['students', _this.student()._key, 'rfid'],
          returnMsg: 'student.rfid.saved',
          data: ko.mapping.toJS(_this.rfid())
        }, 'vmStudentRfid:47');
        _this.student().rfid = _this.rfid();
        _rfidField.focus();
        _this.dirty(false);
      };
    };
  });