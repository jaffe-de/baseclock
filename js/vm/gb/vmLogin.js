define(['messages', 'firebase', 'login'], function (messages, firebase, login) {
	
	return function vmLogin() {

		var _this = this;

		this.visible = ko.observable(true);
		this.username = ko.observable('rjaffe');
		this.password = ko.observable('thumper');
		this.loginFailed = ko.observable(false);
		this.canLogin = ko.computed(function () {
			return ((this.username().length > 0) && (this.password().length > 0));
		}, this);

		messages.subscribe('control.login', function(args) {
			_this.visible(false);
		});
		messages.subscribe('control.loginFailedPassword', function (args) {
			_this.loginFailed(true);
		})

		this.login = function() {
			_this.loginFailed(false);
			login.login(_this.username(), _this.password());
		};

	}; 

});


