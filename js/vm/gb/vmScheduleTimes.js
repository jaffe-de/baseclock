define(
  ['utilities', 'messages', 'models'], function(utilities, messages, models) {

    return function VMScheduleTimes() {

      var _this = this;
      var _revert;
      var _editing = 0;
      this.classes = {};
      this.scheduleNames = ko.observableArray([]);
      this.selectedScheduleNameKey = ko.observable();
      this.scheduleTimes = ko.observableArray([]);
      this.filteredScheduleTimes = ko.computed(function() {
        var arr = $.grep(_this.scheduleTimes(), function(el, idx) {
          return el.scheduleKey === _this.selectedScheduleNameKey();
        });
        arr.sort(function(a, b) {
          if (_this.classes[a.classKey] && _this.classes[b.classKey]) {
            return (_this.classes[a.classKey].period < _this.classes[b.classKey].period) ? -1 :
              (_this.classes[a.classKey].period > _this.classes[b.classKey].period) ? 1 : 0;
          } else {
            return -1;
          }
        });
        return arr;
      }, this);
      this.selectedScheduleTimeKey = ko.observable();
      this.selectedScheduleTimeKey.subscribe(function (newValue) {
        messages.publish('view.scheduleTimeSelected', {key: newValue});
      });
      this.visible = ko.observable(false);
      this.dirty = ko.observable(false);

      messages.subscribe('data.scheduleNames', function(data) {
        _this.scheduleNames(utilities.sortOnField(data.array, ['name']));
      });

      // messages.subscribe('data.scheduleTimes', function(data) {
      //   _this.scheduleTimes(utilities.sortOnField(data.array, ['name']));
      // });

      messages.subscribe('data.classes', function(data) {
        _this.classes = data.object;
        _this.classesArray = utilities.sortOnField(data.array);
      });

      messages.subscribe('data.pushScheduleTimes', function(data) {
        _this.selectedScheduleTimeKey(data.key);
      });

      messages.subscribe('data.scheduleTimeRemoved', function(data) {
        _this.selectedScheduleTimeKey('');
      });

      messages.subscribe('scheduleTimeSelected', function(data) {

      });

      // Listen for editing messages from VMs that edit classes
      messages.subscribe('view.scheduleTime.beginEdit', function(data) {
        _editing++;
      });
      messages.subscribe('view.scheduleTime.endEdit', function(data) {
        _editing = Math.max(0, _editing - 1);
      });

      this.getTimeText = function (item) {
        var per = 'Per -';
        if (_this.classes[item.classKey]) {
          per = 'Per '+_this.classes[item.classKey].period+' '+_this.classes[item.classKey].name;
        }
        return item.startTime+' - '+item.endTime+' | '+per;
      };

      this.click = function(key) {
        if (_editing > 0) {
          bootbox.confirm('The changes to this schedule time will be lost if you select another schedule time.  Are you sure?', function(result) {
            if (result) {
              _editing = 0;
              _this.click(key);
            }
          });
        } else {
          _this.selectedScheduleTimeKey(key);
        }

      };

      this.add = function() {
        if (_editing > 0) {
          bootbox.confirm('The changes to this schedule time will be lost if you add another schedule time.  Are you sure?', function(result) {
            if (result) {
              _editing = 0;
              _this.add();
            }
          });
        } else {
          var st = models.newModel('MScheduleTimes');
          st.scheduleKey = _this.selectedScheduleNameKey();
          messages.publish('data', {
            request: 'push',
            dataType: 'gradebook',
            keys: ['scheduleTimes'],
            data: st,
            returnMsg: 'pushScheduleTime'
          });
        }
      };

      this.del = function() {
        bootbox.confirm('Are you sure you want to delete this schedule time? This cannot be undone', function(result) {
          if (result) {
            messages.publish('data', {
              request: 'remove',
              dataType: 'gradebook',
              keys: ['scheduleTimes', _this.selectedScheduleTimeKey()],
              returnMsg: 'scheduleTimeRemoved'
            });
          }
        });
      };
    };
  });