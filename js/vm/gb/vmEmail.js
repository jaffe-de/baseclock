define(['utilities', 'messages', 'models', 'progressReport', 'svc/svcPRUtilities'], function (utilities, messages, models, pr, svcPRUtilities)  {
	
	return function VMEmail() {
		var _this = this;
		var _delay = 750;
		this.dirty = ko.observable(false);

		this.classes = ko.observableArray([]);
		this.students = ko.observableArray([]);
		this.studentKeys = ko.observableArray([]);
		this.studentKeys.subscribe(function(students) {
			var roster = [];
			var len = students.length;
			while (len--) {
				var stu = _this.students()[students[len].studentId];
				var cl = students[len].classId;
				roster.push({
					_key: students[len].studentId,
					lastName: stu.lastName,
					firstName: stu.firstName,
					email: stu.email,
					contactEmails: stu.contactEmails,
					classId: [cl],
					selected: ko.observable(false)
				});
			}
			_this.studentRoster(_mergeDuplicateStudents(roster.sort(function(a, b) {
				return (a.lastName+a.firstName < b.lastName+b.firstName) ? -1 :
					(a.lastName+a.firstName > b.lastName+b.firstName) ? 1 : 0;
			})));
		});
		this.studentRoster = ko.observableArray([]);
		this.studentRoster.subscribe(function () {

		});
		this.studentEmail = ko.observable(true);
		this.parentEmail = ko.observable(true);
		this.message = ko.observable('');
		this.sentTo = ko.observable('');
		this.studentCount = ko.observable('');
		var _user;

    messages.subscribe('data.classes', function(data) {
      _this.classes(_processClassItems(utilities.clone(data.array)));
    });

    messages.subscribe('data.students', function(data) {
      _this.students(data.object);
    });

    messages.subscribe('control.login', function (data) {
      _user = data.firebase.user;
    });

		var _updateStudentList = function () {
			var sArr = [];
			var cArr = ko.mapping.toJS(_this.classes());
			var len = cArr.length;
			while (len--) {
				if (cArr[len].selected) {
					var temp = cArr[len].enrollment.split('.');
					var tempLength = temp.length;
					for (var j=0; j<tempLength; j++) {
						sArr.push({classId: cArr[len]._key, studentId: temp[j]});
					}
				}
			}
			_this.studentKeys(sArr);
		};
		
		_processClassItems = function(arr) {
			if (arr) {
				var len = arr.length;
				while(len--) {
					arr[len].selected = false;
					arr[len] = ko.mapping.fromJS(arr[len]);
					arr[len].students = arr[len].enrollment().split('.');
				}
			}
			return arr;
		};

		_updateStudentCount = function() {
			var c = 0;
			if (_this.studentRoster && (_this.studentRoster().length>0)) {
				$.each(_this.studentRoster(), function (i, student) {
					c += (student.selected()) ? 1 : 0;
				});
			}
			var txt = 'There ';
			txt += (c === 0) ? 'are no students selected' : (c === 1) ? 'is 1 student selected' : 'are '+c+' students selected';
			_this.studentCount(txt);
		};

		_mergeDuplicateStudents = function(students) {
			var arr = students.slice(0);
			var i=0, lastIdx;
			while(i<arr.length) {
				if (i && (arr[i]._key === arr[lastIdx]._key)) {
					arr[lastIdx].classId = arr[lastIdx].classId.concat(arr[i].classId);
					arr.splice(i,1);
					l = arr.length;
				} else {
					lastIdx = i;
					i++;
				}
			}
			return arr;
		};
		
		this.toggleClass = function (aClass, el) {
			aClass.selected(!aClass.selected());
			_updateStudentList();
			_updateStudentCount();
		};

		this.toggleStudent = function (aStudent, el) {
			aStudent.selected(!aStudent.selected());
			_updateStudentCount();
		};

		_selectStudent = function(direction) {
			if (_this.studentRoster && (_this.studentRoster().length>0)) {
				$.each(_this.studentRoster(), function (i, student) {
					student.selected(direction);
				});
			}
			_updateStudentCount();
		};

		this.selectAll = function (){
			_selectStudent(true);
		};

		this.selectNone = function() {
			_selectStudent(false);
		};

		this.emailsToClipboard = function() {
			var tag = '<div><p>Click Ctrl-C to copy to clipboard (Command-C for Macs)</p><textarea class="form-control copy-paste" rows="10"></textarea></div>';
			var text = [];
			if (_this.studentRoster && (_this.studentRoster().length>0)) {
				$.each(_this.studentRoster(), function (i, stu) {
					if (stu.selected()) {
						if (_this.studentEmail()) {
							text.push(stu.email());
						}
						if (_this.parentEmail() && stu.contactEmails() && stu.contactEmails().length>0) {
							$.each(stu.contactEmails(), function (i, ce) {
								text.push(ce.email());
							});
						}
					}
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

		this.sendEmail = function() {
			_this.sentTo('');
			$.each(_this.studentRoster(), function (idx, student) {
				if (student.selected()) {
					for (var i=0; i<student.classId.length; i++) {
						var progressReport = pr.createText(student._key, student.classId[i]);
						var emails = [];
						if (_this.studentEmail()) {
							emails.push(student.email);
						}
						if (_this.parentEmail() && student.contactEmails) {
							for (var j=0; j<student.contactEmails.length; j++) {
								emails.push(student.contactEmails[j].email);
							}
						}
						var emailText = emails.join(',');
						var message = (_this.message().length === 0) ? progressReport.text : "\n\n"+progressReport.text;
						$.ajax({
							url: 'php/sendEmail.php',
							type: 'post',
							data: {
								emails: emailText,
								message: message,
								subject: svcPRUtilities.getSubject(student, progressReport.thisClass),
								from: _user.email,
								lastName: student.lastName,
								firstName: student.firstName
							},
							dataType: 'json',
							success: _success,
							error: _error
						});
					}
				}
			});
		};

		_success = function(data, string) {
			var arr = (_this.sentTo().length === 0) ? [] : _this.sentTo().split("\n");
			arr.push(data.lastName+', '+data.firstName);
			arr.sort();
			_this.sentTo(arr.join("\n"));
		};

		_error = function (xhr, errType, obj) {
		};

	};
});