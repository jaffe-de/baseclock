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
      dataType: 'MScheduleTimes',
      table: 'scheduleTimes',
      formId: '#schedule-time-info-form',
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
        itemSelected: 'scheduleTimeSelected',
        itemRetrieved: 'scheduleTime',
        itemSaved: 'scheduleTimeSaved',
        beginEdit: 'view.schedule.time.beginEdit',
        endEdit: 'view.schedule.time.endEdit'
      }
    });

    var _this = this;

    this.classes = ko.observableArray([]);
    this.selectedClassKey = ko.observable('');
    messages.subscribe('data.classes', function(data) {
      _this.classes(utilities.sortOnField(data.array, ['period']));
    });

    this.caption = ko.computed(function() {
      // return this.item().name();
    }, this);
    $('.timepicker').timepicker();
    // Add Bootstrap V3 icon classes to substitute for the V2 icon classes
    $('.icon-chevron-up').addClass('glyphicon').addClass('glyphicon-chevron-up');
    $('.icon-chevron-down').addClass('glyphicon').addClass('glyphicon-chevron-down');


  };
});