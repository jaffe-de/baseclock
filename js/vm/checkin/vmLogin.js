define(['messages', 'firebase', 'login'], function(messages, firebase, login) {

  return function vmLogin() {

    var _this = this;

    this.username = ko.observable($.QueryString["t"]);
    this.password = ko.observable('thumper');
    this.noUsername = ko.computed(function () {
      return !this.username();
    }, this);
    this.loginFailed = ko.observable(false);
    this.authenticated = ko.observable(false);
    this.gradebookList = ko.observableArray([]);
    this.selectedGradebook = ko.observable();
    this.multipleGradebooks = ko.computed(function (newValue) {
      return this.gradebookList().length > 1;
    }, this);
    this.visible = ko.observable('true');
    this.canLogin = ko.computed(function() {
      return (!this.username() || (this.username().length > 0) && (this.password().length > 0));
    }, this);

    $.ajax({
      url: 'php/getGradebookList.php',
      data: {
        username: this.username()
      },
      type: 'post',
      dataType: 'json',
      success: function(data) {
        _this.gradebookList(data.gb);
      }
    });

    messages.subscribe('control.login', function(args) {
      _this.visible(false);
      $('.hide-on-startup').show();
      messages.publish('view.gradebookSelected', {_key: _this.selectedGradebook()}, 'vmLogin:40');
      messages.publish('data', {request: 'once', dataType: 'gradebookList', keys: [_this.selectedGradebook()], returnMsg: 'gradebook'}, 'vmLogin:40');
    });

    messages.subscribe('control.loginFailedPassword', function(args) {
      _this.loginFailed(true);
    });

    this.login = function() {
      _this.loginFailed(false);
      login.login(_this.username(), _this.password());
    };

  };

});