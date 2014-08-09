define(['base/baseItemInfo', 'utilities', 'messages'], function(BaseItemInfo, utilities, messages) {

  return function VMScheduleNameInfo() {

    // Inputs: options
    //  dataType:                     (string) Item's data type
    //  table:                        Table where data lives <user>/gradebooks/ID/<table>
    //  formId:                       Form ID that should be validated
    //  validatorOptions:             Validator options for item information
    //  caption:                      Returns the caption for the info page
    //  messages:                     Object with message texts
    //    itemKey:                    Item key message retrieved by item list VM
    //    itemRetrieved:              Received from firebase with item data
    //    itemSaved:                  Received when item saved
    //    beginEdit:                  Indicate editing
    //    endEdit:                    Indicate editing ended
    BaseItemInfo.call(this, {
      dataType: 'MScheduleNames',
      table: 'scheduleNames',
      formId: '#schedule-name-info-form',
      validatorOptions: {
        rules: {
          name: {
            required: true
          },
        },
        errorPlacement: utilities.errorPlacement
        // highlight: _services.utilities.highlight,
        // success: _services.utilities.success       
      },
      messages: {
        itemSelected: 'scheduleNameSelected',
        itemRetrieved: 'scheduleName',
        itemSaved: 'scheduleNameSaved',
        beginEdit: 'view.schedule.name.beginEdit',
        endEdit: 'view.schedule.name.endEdit'
      }
    });

    this.caption = ko.computed(function () {
      return this.item().name();
    }, this);

    var _this = this;

  };
});