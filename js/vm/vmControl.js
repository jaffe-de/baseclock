define(['knockout', 'messages', 'utilities'], function (ko, messages, utilities) {
	

	return function vmDecimal() {
		var _this = this;
		
		this.paused = ko.observable(false);
		this.buttonLabel = ko.computed(function () {
			return (this.paused()) ? 'Resume' : 'Pause';
		}, this);

		this.pause = function() {
			_this.paused(!_this.paused());
			messages.publish('clock.pause');
		};

	};
});
