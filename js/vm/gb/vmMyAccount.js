define(['firebase', 'utilities', 'messages', 'models'], 
	function (firebase, utilities, messages, models)  {
	
	return function vmMyAccount() {
		var _this = this;

		this.dirty = ko.observable(false);
		this.password1 = ko.observable('');
		this.password2 = ko.observable('');
		this.myAccount = ko.observable(models.newModel('MAccount'));
		this.gradebooks = ko.observableArray([]);
		var _revert;

		messages.subscribe('control.firebaseReady', function (args) {
			_this.myAccount(ko.mapping.fromJS(args.firebase.user));
			_revert = utilities.clone(args.firebase.user);
		});

		messages.subscribe('data.account', function (data) {
			_this.dirty(false);
			if (_revert.username !== _this.myAccount().username()) {
				messages.publish('control.changeUsername', {oldUsername: _revert.username, newUsername: _this.myAccount().username()});
			};
		});
		
		messages.subscribe('control.changeUsername.OK', function () {
			location.reload();
		});
		
		messages.subscribe('data.gradebooks', function(gradebooks) {
			_this.gradebooks(utilities.sortOnField(gradebooks.array, ['name']));
		});

		var _validator = $('#my-account-info-form');
		_validator.validate({
			rules: {
				username: {
					required: true,
					remote: {
						url: "php/usernameAvailable.php",
						data: {
							currentUsername: function () {
								return _revert.username;
							}
						},
						type: "POST"
					}
				},
				teacherName: {
					required: true
				},
				teacherEmail: {
					required: true,
					email: true
				},
				scorePrecision: {
					required: true,
					min: 0,
					max: 4
				},
				summaryPrecision: {
					required: true,
					min: 0,
					max: 4
				},
				password2: {
					equalTo: "#password1"
				}
			},
			messages: {
				password2: {
					equalTo: "Passwords must match"
				},
				username: {
					remote: "Username is not available"
				}
			},
			// errorPlacement: utilities.errorPlacement
			highlight: utilities.highlight,
			success: utilities.success,
			errorClass: 'error-text'
		});

		this.saveClick = function () {
			bootbox.confirm('You may need to login again after you change your account information.', function(result) {
				if (result && _validator.valid()) {
					var _data = ko.mapping.toJS(_this.myAccount());
					if (!_data.studentGradebook) {
						_data.studentGradebook = '';
					}
					if (_this.password1()) {
						_data.password = CryptoJS.SHA1(_this.password1()).toString();
					} else {
						delete (_data.password);
					}
					var newUsername = _data.username;
					messages.publish('data', {request: 'update', dataType: 'user', returnMsg: 'account', data: _data});
				}
			});
		};

		this.cancelClick = function () {
			_this.myAccount(ko.mapping.fromJS(_revert));
			_this.password1('');
			_this.password2('');
			_validator.valid();
			_this.dirty(false);
		};
		
		this.change = function() {
			_validator.valid();
			if (!_this.dirty()) {				
				_this.dirty(true);
			}
		};

		this.selectChange = function (vm, evt) {
			if (evt.bubbles) {
				_this.change();
			}
		};

	};
});


