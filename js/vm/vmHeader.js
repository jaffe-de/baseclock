define(['knockout', 'messages'], function (ko, messages) {

	return function vmHeader() {

		var _this = this;
		var _visible = ko.observable(false);
		var _headerTitle = ko.observable('No gradebook selected');
		var _headerTeacherName = ko.observable('');

		this.visible = _visible;
		this.headerTitle = _headerTitle;
		this.headerTeacherName = _headerTeacherName;
	};
	
});

