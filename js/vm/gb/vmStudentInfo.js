define(['base/baseItemInfo', 'utilities', 'messages'], function (BaseItemInfo, utilities, messages) {
	
	return function VMStudentInfo() {
	
		// Inputs: options
		//  dataType: 										(string) Item's data type
		//  table: 												Table where data lives <user>/gradebooks/ID/<table>
		//  formId: 											Form ID that should be validated
		//  validatorOptions: 						Validator options for item information
		//  caption: 											Returns the caption for the info page
		//  messages: 										Object with message texts
		//		itemKey: 										Item key message retrieved by item list VM
		//  	itemRetrieved: 							Received from firebase with item data
		// 		itemSaved: 									Received when item saved
		// 		beginEdit: 									Indicate editing
		// 		endEdit: 										Indicate editing ended
		BaseItemInfo.call(this, {	
			dataType: 				'MStudent',
			table: 						'students',
			formId: 					'#student-info-form',
			validatorOptions: {
				rules: {
					firstName: {
						required: true
					},
					lastName: {
						required: true
					},
					studentId: {
						required: true
					},
					email: {
						email: true
					},
					studentPhone: {
						phoneUS: true
					},
					cellPhone: {
						phoneUS: true
					}
				},
				errorPlacement: utilities.errorPlacement
				// highlight: _services.utilities.highlight,
				// success: _services.utilities.success				
			},
			messages: {
				itemSelected:			'studentSelected',
				itemRetrieved: 		'student',
				itemSaved: 				'studentSaved',
				beginEdit: 				'view.student.beginEdit',
				endEdit: 					'view.student.endEdit'
			}
		});

		var _this = this;
		var _delay = 800;
		
		this.custom1 = ko.observable('');
		this.custom2 = ko.observable('');
		this.classes = ko.observableArray([]);
		this.enrollmentText = ko.computed(function() {
			var c = _this.classes();
			var key = _this.key();
			var txt = '';
			if (c && (c.length>0) && key && (key.length>0)) {
				$.each(c, function (i, aClass) {
					if (aClass.enrollment.indexOf(key) >= 0) {
						var t = 'Per '+aClass.period+' '+aClass.name;
						txt += (txt.length === 0) ? t : '<br/>'+t;
					}
				});
			}
			return txt;
		});
		
		this.caption = ko.computed(function() {
			return utilities.getName(ko.toJS(_this.item()));
		});
		
		messages.subscribe('data.classes', function(data) {
			_this.classes(data.array);
		});
		
		this.beforeSave = function () {
			_this.item().studentPhone(utilities.formatPhone(_this.item().studentPhone()));
			_this.item().cellPhone(utilities.formatPhone(_this.item().cellPhone()));
		};

		this.copyToClipboard = function(what) {
			var tag = '<div><p>Click Ctrl-C to copy to clipboard (Command-C for Macs)</p><textarea class="form-control copy-paste"></textarea></div>';
			var text = [];
			var s = ko.mapping.toJS(this.item());
			if ((what === 'students') || (what === 'both')) {
				text.push(s.email);
			};
			if ((what === 'contacts') || (what === 'both')) {
				$.each(s.contactEmails, function (i, email) {
					text.push(email.email);
				});
			}
			var dlgText = $(tag);
			dlgText.find('textarea').html(text.join('; '));
			bootbox.dialog({
				message: dlgText,
				title: 'Copy/paste',
				buttons: {
					ok: {
						label: "OK",
						className: "btn-primary"
					}
				}
			});
			setTimeout(function () {
				dlgText.find('textarea').select();
			}, _delay);
		};
	};
});


