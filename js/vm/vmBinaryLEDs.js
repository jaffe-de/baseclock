define(['knockout', 'messages', 'utilities'], function (ko, messages, utilities) {
	

	return function vmBinaryLEDs() {
		var _this = this;
		
		this.visible = ko.observable(false);
		this.hour = ko.observableArray([]);
		this.minute = ko.observableArray([]);
		this.second = ko.observableArray([]);

		messages.subscribe('clock.update', function (time) {
			_this.visible(true);
			_this.hour(toBinary(time.hour, 6));
			_this.minute(toBinary(time.minute, 6));
			_this.second(toBinary(time.second, 6));
		});

		function toBinary(n, digits) {
			var arr = [];
			for (var i = digits-1; i >= 0; i--) {
				var base = Math.pow(2, i);
				arr.push((n & base) > 0);
			}
			return arr;
		}

	};
});
