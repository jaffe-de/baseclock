define(['knockout', 'messages', 'utilities'], function (ko, messages, utilities) {
	

	return function vmBinaryLEDs() {
		var _this = this;
		
		this.visible = ko.observable(false);
		this.data = ko.observableArray([]);

		messages.subscribe('clock.update', function (time) {
			_this.visible(true);
			var hour = toBinary(time.hour, 6);
			var minute = toBinary(time.minute, 6);
			var second = toBinary(time.second, 6);
			var data = [];
			for (var i=0; i<6; i++) {
				var row = [];
				row.push(hour[i]);
				row.push(minute[i]);
				row.push(second[i]);
				data.push(row);
			}
			_this.data(data);
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
