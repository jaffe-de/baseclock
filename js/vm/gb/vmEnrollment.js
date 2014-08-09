define(['base/baseIncludeCheckbox', 'messages'], function (BaseIncludeCheckbox, messages) {
	
	return function VMEnrollment() {

		BaseIncludeCheckbox.call(this, {	
			item1Table: 						'classes',
			item2Table: 						'students',
			includeField: 					'enrollment',
			sortOnFields: 					['lastName', 'firstName'],
			messages: {
				item1Selected: 				'classSelected',
				item1Received:				'class',
				item2Received:				'students',
				beginEdit: 						'view.class.beginEdit',
			 	endEdit: 							'view.class.endEdit',
				savedMsg: 						'includeStudentSaved'
			}
		});

		var _this = this;
		
		this.enrolledList = ko.observableArray([]);

		messages.subscribe('data.class', function (args) {
			_createEnrolledList();
		});

		this.afterSave = function () {
			_createEnrolledList();
		};
		
		function _createEnrolledList() {
			var studentKeyList = _this.item1List().join('.');
			var eList;
			if (_this.item2()) {
				eList = $.grep(_this.item2(), function(item, idx) {
					return (studentKeyList.indexOf(item._key) >= 0);
				});
			} else {
				elist = [];
			}
			_this.enrolledList(eList);
		};

		function _getEnrolledCount() {
			return $.grep(_this.item1List(), function(el, idx) {
				return (el !== '');
			}).length;
			// return _this.item1List().length;
		};

		this.caption = ko.computed(function () {
			return 'Check to enroll ('+_getEnrolledCount()+' students are checked)';
		}, _this);
	};
});

