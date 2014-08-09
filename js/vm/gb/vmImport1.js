/*jshint loopfunc: true */
define(['messages'], function (messages) {
  
  return function VMImport1() {

    var _this = this;
    this.importText = ko.observable('');
    this.visible = ko.observable(true);
    this.enableNext = ko.computed(function() {
      return _this.importText().length > 0;
    }, this);

    messages.subscribe('import.wizard.to.step.1', function () {
      _this.visible(true);
    });

    this.next = function () {
      _this.visible(false);
      messages.publish('import.wizard.to.step.2', {data: $.csv()(_this.importText())});
    };

  };
});
