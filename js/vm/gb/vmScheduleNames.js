define(
  ['utilities', 'messages', 'models'], function(utilities, messages, models) {

    return function VMScheduleNames() {

      var _this = this;
      var _revert;
      var _editing = 0;
      this.scheduleNames = ko.observableArray([]);
      this.selectedScheduleNameKey = ko.observable('');
      this.selectedScheduleNameKey.subscribe(function(key) {
        _editing = 0;
        messages.publish('view.scheduleNameSelected', {
          key: key
        });
      });
      this.visible = ko.observable(false);
      this.dirty = ko.observable(false);

      messages.subscribe('data.scheduleNames', function(data) {
        _this.scheduleNames(utilities.sortOnField(data.array, ['name']));
        for (var i=0; i<data.array.length; i++) {
          if (data.array[i].defaultSchedule) {
            _this.selectedScheduleNameKey(data.array[i]._key);
          }
        }
      });

      // New class was added
      messages.subscribe('data.pushScheduleNames', function(data) {
        _this.selectedScheduleNamesKey(data.key);
      });

      // Listen for editing messages from VMs that edit classes
      messages.subscribe('view.scheduleName.beginEdit', function(data) {
        _editing++;
      });
      messages.subscribe('view.scheduleName.endEdit', function(data) {
        _editing = Math.max(0, _editing - 1);
      });



      this.click = function(key) {
        if (_editing > 0) {
          bootbox.confirm('The changes to this schedule will be lost if you select another schedule.  Are you sure?', function(result) {
            if (result) {
              _editing = 0;
              _this.click(key);
            }
          });
        } else {
          _this.selectedScheduleNameKey(key);
        }

      };

      this.add = function() {
        if (_editing > 0) {
          bootbox.confirm('The changes to this schedule will be lost if you add another schedule.  Are you sure?', function(result) {
            if (result) {
              _editing = 0;
              _this.add();
            }
          });
        } else {
          messages.publish('data', {
            request: 'push',
            dataType: 'gradebook',
            keys: ['scheduleNames'],
            data: models.newModel('MScheduleNames'),
            returnMsg: 'pushScheduleName'
          });
        }
      };

      this.del = function() {
        bootbox.confirm('Are you sure you want to delete this schedule? This cannot be undone', function(result) {
          if (result) {
            messages.publish('data', {
              request: 'remove',
              dataType: 'gradebook',
              keys: ['scheduleNames', _this.selectedScheduleNameKey()],
              returnMsg: 'scheduleNameRemoved'
            });
          }
        });
      };
    };
  });