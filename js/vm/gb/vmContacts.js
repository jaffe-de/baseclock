define(['base/baseItemArray', 'constants', 'utilities'], 
	function (BaseItemArray, constants, utilities) {
	
	return function VMContacts() {

		BaseItemArray.call(this, {
			dataType: 						'MContact',
			table:  							'students',
			field: 								'contacts',
		 	messages: {
				selectedItem: 			'view.studentSelected',
		  	itemRetrieved: 			'student',
				beginEdit: 					'view.student.beginEdit',
				endEdit: 						'view.student.endEdit',
				saved: 							'contacts'
			}
		});

		var _this = this;

		this.caption = ko.observable('Student contacts');
		this.beforeSave = function() {
			var contacts = ko.mapping.toJS(_this.array());
			$.each(contacts, function(i, contact) {
				contact.phone = utilities.formatPhone(contact.phone);
			});
			_this.array(contacts);
		};
		
		this.validate = function(_array) {
			var valid = 0;
			$.each(_array, function (i, contact) {
				valid += (utilities.validate(contact, 'name', constants.nameRegex, $('[name="name"]')[i])) ? 0 : 1;
				valid += (utilities.validate(contact, 'phone', constants.phoneRegex, $('[name="phone"]')[i])) ? 0 : 1;
				valid += ((contact.name.length > 0) && (contact.phone.length > 0)) ? 0 : 1;
			});
			return (valid === 0) ? true : false;
		};		
	};	
});
