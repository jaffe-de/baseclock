define (['messages', 'firebase', 'utilities'], 
	function (messages, firebase, utilities) {

	return function VMStudentEnrollment() {

		var _this = this;
		var _revert;

		this.student = ko.observable();
		this.student.subscribe(function (key) {
			_getEnrollmentArray();
		});
		
		var _classes = ko.observableArray([]);
		_classes.subscribe(function() {
			_getEnrollmentArray();
		});

		this.enrollmentArray = ko.observableArray([]);
		this.dirty = ko.observable(false);

		this.caption = ko.computed(function () {
			return 'Student: '+utilities.getName(_this.student());
		}, _this);

		messages.subscribe('data.student', function(data) {
			_this.student(data.object);
		});
		
		messages.subscribe('data.classes', function(data) {
			_classes(data.array);
		});

		messages.subscribe('data.enrollmentArray', function(data) {
			messages.publish('view.students.endEdit');
			_this.dirty(false);
			_revert = utilities.clone(_this.enrollmentArray());
		});

		function _getEnrollmentArray() {
			var ea = [];
			if (_classes() && (_classes().length>0) && _this.student()) {
				$.each(_classes(), function (i, aClass) {
					ea.push({
						enrolled: (typeof(aClass.enrollment) === 'string') ? $.inArray(_this.student()._key, aClass.enrollment.split('.')) >= 0 : [''], 
						name: 'Per ' + aClass.period + ' ' + aClass.name,
						classKey: aClass._key,
						enrollment: aClass.enrollment
					});
				});
			}
			_this.enrollmentArray(ea);
			_revert = utilities.clone(ea);		
		};

		this.click = function() {
			if (!_this.dirty()) {
				_this.dirty(true);
				messages.publish('view.students.beginEdit');
			}
		};
		
		this.save = function() {
			_revert = utilities.clone(_this.enrollmentArray());			
			$.each(_this.enrollmentArray(), function (i, ea) {
				var arr = ea.enrollment.split('.');
				if (ea.enrolled) {
					if ($.inArray(_this.student()._key, arr) === -1) {
						arr.push(_this.student()._key);
					}
				} else {
					var loc = $.inArray(_this.student()._key, arr);
					if (loc >= 0) {
						arr.splice(loc, 1);
					}
				}
				var newEnrollment = arr.join('.');
				messages.publish('data', {request: 'set', dataType: 'gradebook', keys: ['classes', ea.classKey, 'enrollment'], returnMsg: 'enrollmentArray', data: newEnrollment});
			});
		};
		
		this.cancel = function() {
			_this.enrollmentArray(utilities.clone(_revert));
			_this.dirty(false);
			messages.publish('view.students.endEdit');		
		};
	};		
});

