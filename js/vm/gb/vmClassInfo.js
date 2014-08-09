define(['base/baseItemInfo', 'utilities', 'constants'],
  function(BaseItemInfo, utilities, constants) {

    return function VMClassInfo() {
      BaseItemInfo.call(this, {
        dataType: 'MClass',
        table: 'classes',
        formId: '#class-info-form',
        validatorOptions: {
          rules: {
            className: {
              required: true
            },
            shortName: {
              required: true,
              maxlength: 15,
              minlength: 1
            },
            period: {
              required: true
            },
            gradeSystem: {
              required: true
            }
          },
          errorPlacement: utilities.errorPlacement
          // highlight: _services.utilities.highlight,
          // success: _services.utilities.success				
        },
        messages: {
          itemSelected: 'classSelected',
          itemRetrieved: 'class',
          itemSaved: 'classSaved',
          beginEdit: 'view.class.beginEdit',
          endEdit: 'view.class.endEdit'
        }
      });

      var _this = this;

      this.caption = ko.computed(function() {
        return 'Per ' + _this.item().period() + ' ' + _this.item().name();
      }, this);

      this.gradeSystems = ko.observable(constants.gradeSystems);
    };
  });