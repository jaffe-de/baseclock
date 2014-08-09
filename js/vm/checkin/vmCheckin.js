define(['messages', 'firebase', 'login'], function(messages, firebase, login) {

  var _currentTimeDelay = 1000;

  return function vmCheckin() {

    var _this = this;
    this.currentTime = ko.observable('');
    this.visible = ko.observable(false);
    this.gradebookName = ko.observable('None selected');
    this.id = ko.observable('');
    this.lastStudent = ko.observable('Next student...');
    this.notFound = ko.observable('false');
    this.online = ko.observable('false');
    this.queueLength = ko.observable(0);
    this.status = ko.computed(function () {
      return (this.online()) ? 'Status: Online ('+_this.queueLength()+')' : 'Status: Offline ('+_this.queueLength()+')';
    }, this);

    keyHandler = function(e) {
      console.log(e.keyCode);
      if (e.keyCode === 13) {
        messages.publish('checkin.submit', {
          id: _this.id()
        });
        _this.id('');
      }
    };

    $(document).bind('keyup', keyHandler); // Bind keyup handler

    messages.subscribe('control.login', function(args) {
      _this.visible(true);
    });

    messages.subscribe('data.gradebook', function(args) {
      _this.gradebookName(args.object.name);
    });

    messages.subscribe('student.checkin.text', function(args) {
      _this.lastStudent(args.text);
    });

    messages.subscribe('control.connectionOn', function () {
      _this.online(true);
    });

    messages.subscribe('control.connectionOff', function () {
      _this.online(false);
    });
    
    messages.subscribe('student.checkin.queue.length', function (args) {
      _this.queueLength(args.length);
    });

    _getCurrentTime = function() {
      return moment().format('h:mm:ss A');
    };

    setInterval(function() {
      _this.currentTime(_getCurrentTime());
    }, _currentTimeDelay);

    this.focusInput = function() {
      $('[name="id"]').focus();
      $('[name="id"]').select();
    };

  };

});