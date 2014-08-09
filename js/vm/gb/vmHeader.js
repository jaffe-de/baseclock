define(['messages', 'firebase'], function (messages, firebase) {

	return function vmHeader() {

		var _this = this;
		var _visible = ko.observable(false);
		var _headerTitle = ko.observable('No gradebook selected');
		var _headerTeacherName = ko.observable('');

		messages.subscribe('control.login', function (data) {
			_visible(true);
			_headerTeacherName(data.firebase.user.name);
		});

		messages.subscribe('data.gradebook', function(data) {
			if (data.object) {
				_headerTitle(data.object.name);
			}
		});

		this.visible = _visible;
		this.headerTitle = _headerTitle;
		this.headerTeacherName = _headerTeacherName;
	};
	
});

