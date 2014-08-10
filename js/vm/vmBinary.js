define(['knockout', 'messages', 'utilities'], function (ko, messages, utilities) {
	

	return function vmBinary() {
		var _this = this;
		
		this.visible = ko.observable(false);
		this.hour = ko.observable('');
		this.minute = ko.observable('');
		this.second = ko.observable('');
		this.time = ko.computed(function () {
			return this.hour()+' : '+this.minute()+' : '+this.second();
		}, this);

		messages.subscribe('clock.update', function (time) {
			_this.visible(true);
			_this.hour(utilities.leadingZero(time.hour.toString(2), 5));
			_this.minute(utilities.leadingZero(time.minute.toString(2), 6));
			_this.second(utilities.leadingZero(time.second.toString(2), 6));			
		});

	};
});
