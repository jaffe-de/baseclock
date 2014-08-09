define(['base/baseItemArray', 'constants', 'utilities'], 
	function (BaseItemArray, constants, utilities) {
	
	return function VMContactEmails() {

		BaseItemArray.call(this, {
			dataType: 						'MContactEmail',
			table:  							'students',
			field: 								'contactEmails',
		 	messages: {
				selectedItem: 			'view.studentSelected',
		  	itemRetrieved: 			'student',
				beginEdit: 					'view.student.beginEdit',
				endEdit: 						'view.student.endEdit',
				saved: 							'contactEmails'
			}
		});

		var _this = this;

		this.caption = ko.observable('Student contact emails');

		this.validate = function(_array) {
			var valid = 0;
			$.each(_array, function (i, contactEmail) {		
				valid += (utilities.validate(contactEmail, 'email', constants.emailRegex, $('#contact-email-form [name="email"]')[i])) ? 0 : 1;
				valid += (contactEmail.email.length > 0) ? 0 : 1;
			});
			return (valid === 0) ? true : false;
		};		
	};	
});