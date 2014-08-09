define(['base/baseItemInfo', 'messages', 'firebase', 'utilities'],
  function(BaseItemInfo, messages, firebase, utilities) {

    return function VMAssignmentInfo() {

      BaseItemInfo.call(this, {
        dataType: 'MAssignment',
        table: 'assignments',
        formId: '#assignment-info-form',
        validatorOptions: {
          rules: {
            name: {
              required: true
            },
            date: {
              required: true,
              date: true
            },
            url: {
              url: true
            },
            weight: {
              required: true,
              min: 1
            },
            category: {
              required: true,
              minlength: 1
            }
          },
          messages: {
            category: {
              required: "Please select a category"
            }
          },
          errorPlacement: utilities.errorPlacement
          // highlight: utilities.highlight,
          // success: utilities.success,
        },
        messages: {
          itemSelected: 'assignmentSelected',
          itemRetrieved: 'assignment',
          itemSaved: 'assignmentSaved',
          beginEdit: 'view.assignment.beginEdit',
          endEdit: 'view.assignment.endEdit'
        }
      });

      var _this = this;

      this.caption = ko.computed(function() {
        return _this.item().name();
      }, _this);

      this.categoryList = ko.observableArray([]);
      messages.subscribe('view.gradebookReady', function(data) {
        messages.publish('data', {
          request: 'on',
          dataType: 'gradebook',
          keys: ['categories'],
          returnMsg: 'categories'
        }, 'vmAssignmentInfo:57');
      });
      messages.subscribe('data.categories', function(data) {
        _this.categoryList(utilities.sortOnField(data.array, ['name']));
      });

      this.selectChange = function(vm, evt) {
        if (evt.bubbles) {
          _this.change();
        }
      };

      this.save = function() {
        _this.beforeSave();
        if (_this.validator.valid()) {
          messages.publish('data', {
            request: 'set',
            dataType: 'gradebook',
            keys: ['assignments', _this.key()],
            returnMsg: 'assignmentSaved',
            priority: _this.item().category(),
            data: ko.mapping.toJS(_this.item())
          }, 'vmAssignmentInfo:save');
        }
      };

      this.formattedDate = ko.computed({
        read: function() {
          var d = utilities.dateToFormatDateWithYear(_this.item().date());
          return d;
        },
        write: function(value) {
          _this.item().date(utilities.formatDateToDate(value));
          _this.dirty(true);
        },
        owner: _this
      });

      this.beforeSave = function() {
        if ((_this.item().url() !== '') && (_this.item().url().indexOf('http://') === -1)) {
          _this.item().url('http://' + _this.item().url());
        }
      };

    };
  });