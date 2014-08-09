define(['messages', 'bootbox', 'utilities', 'moment'], function(messages, bootbox, utilities, moment) {

  return function VMDailyAttendance() {

    var MILLISECONDS_IN_DAY = 86400000;
    var COLUMNS = 2;
    var _this = this;

    window.vmDailyAttendance = this;

    this.formattedDate = ko.observable(moment().format('MM/DD/YYYY'));
    this.classes = ko.observableArray([]);
    this.students = {};
    this.scheduleNames = ko.observableArray([]);
    this.selectedSchedule = ko.observable();
    this.selectedClassKey = ko.observable('');

    this.classIndex = ko.observable({});
    this.classIndex.subscribe(function(newValue) {
      _this.renderGrid();
    });

    // Class list loaded
    messages.subscribe('data.classes', function(data) {
      _this.classes(utilities.sortOnField(data.array, ['period', 'name']));
      _this.createStudentIndex();
    });

    messages.subscribe('data.students', function(data) {
      _this.students = data.object;
      _this.createStudentIndex();
      _this.renderGrid();
      _this.selectClassClick(_this.selectedClassKey());
    });

    this.createStudentIndex = function() {
      var _classIndex = {};
      if (_this.students && _this.classes()) {

        // Create student index by class
        $.each(_this.classes(), function(i, thisClass) {
          _classIndex[thisClass._key] = [];
          var _enrollment = thisClass.enrollment.split('.');
          for (var j = 0; j < _enrollment.length; j++) {
            if (_this.students[_enrollment[j]]) {
              _classIndex[thisClass._key].push(_enrollment[j]);
            }
          }

          // Sort student list
          _classIndex[thisClass._key].sort(function(a, b) {
            var as = _this.students[a];
            var bs = _this.students[b];
            return (as.lastName + as.firstName < bs.lastName + bs.firstName) ? -1 :
              (as.lastName + as.firstName > bs.lastName + bs.firstName) ? 1 : 0;
          });
        });
      }
      _this.classIndex(_classIndex);
    };

    this.renderGrid = function() {
      $('[name="attendanceGrid"]').empty();
      $.each(_this.classes(), function(key, thisClass) {
        var rows = Math.round(_this.classIndex()[thisClass._key].length / COLUMNS);
        for (var i = 0; i < COLUMNS; i++) {
          var div = $('<div class="col-md-4 col-md-offset-1" key="' + thisClass._key + '"></div>');
          var ul = $('<ul class="list-group"></ul>');
          for (var j = 0; j < rows; j++) {
            var _idx = i * rows + j;
            var _stuKey = _this.classIndex()[thisClass._key][_idx];
            if (_stuKey) {
              var student = _this.students[_stuKey];
              var li = $('<li href="#" class="list-group-item compact" studentAttendance studentKey="' + _stuKey + '" classKey="' + thisClass._key + '"></li>');
              timeSpan = (_this.students[_stuKey].checkin === 0) ?
                $('<span class="badge alert-danger"></span>').html('') :
                $('<span class="badge alert-success"></span>').text(moment(_this.students[_stuKey].checkin).format('h:mm:ss'));
              var nameSpan = $('<span>' + student.lastName + ', ' + student.firstName + '</span>');
              if (_this.students[_stuKey].checkin === 0) {
                li.addClass('alert-danger');
              } else {
                li.addClass('alert-success');
              }
              ul.append(li.append(timeSpan).append(nameSpan));
            }
          }
          div.append(ul);
          $('[name="attendanceGrid"]').append(div);
        }
      });
      $('[action]').css('cursor', 'pointer');
      $('[action]').click(function() {
        alert('abc');
      });
    };

    this.selectClassClick = function(classKey) {
      $('[key]').hide();
      $('[key="' + classKey + '"]').show();
      _this.selectedClassKey(classKey);
    };

    this.change = function() {

    };

    this.getAttendance = function(date) {
      var startPriority = moment(date).valueOf();
      var endPriority = startPriority + MILLISECONDS_IN_DAY - 1;
      messages.publish('data', {
        request: 'on',
        dataType: 'gradebook',
        keys: ['attendance'],
        startPriority: startPriority,
        endPriority: endPriority,
        returnMsg: 'attendance'
      });
    };

    $('#attendanceTabs').on('shown.bs.tab', function(evt) {
      _this.pollControl($(evt.target).attr('href') === '#tabsAttendanceAttendance');
    });
  };
});