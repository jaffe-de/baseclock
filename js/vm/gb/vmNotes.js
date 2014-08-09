define(['models', 'firebase', 'messages', 'utilities'], 
	function (models, firebase, messages, utilities) {
	
	return function VMNotes() {
	
		var _this = this;
		var _revertNotes = '';

		var _student = ko.observable(ko.mapping.fromJS(models.newModel('MStudent')));
		this.dirty = ko.observable(false);
		this.studentKey = ko.observable('');
		this.notes = ko.observable('');
		this.visible = ko.computed(function () {
			return (_this.studentKey() !== '');
		});
		this.caption = ko.computed(function () {
			if (_student()) {
				return (_student().nickname() !== "") ? 
					_student().firstName() + ' (' + _student().nickname() + ') ' + _student().lastName() :
					_student().firstName() + ' ' + _student().lastName();
			} else {
				return '';
			}
		}, this);

		messages.subscribe('view.studentSelected', function (data) {
			_this.studentKey(data.key);
		});
		
		messages.subscribe('data.student', function(data) {
			_student(ko.mapping.fromJS(data.object));
			_this.notes(data.object.notes);
			_revertNotes = utilities.clone(data.object.notes);
		});
		
		messages.subscribe('data.notesSaved', function (err) {
			if (!err.error) {
				messages.publish('view.student.endEdit');
				_this.dirty(false);
			}
		});
		
		this.insertDatestamp = function() {
			var notes = (_this.notes()) ? _this.notes() : '';
			var addReturn = (notes !== '') ? "\n" : "";
			_this.notes(notes + addReturn + new Date().toDateString()+': ');
			$('[name="notes"]').putCursorAtEnd();
			_this.change();
		};

		this.change = function() {
			if (!_this.dirty()) {
				messages.publish('view.student.beginEdit');
				_this.dirty(true);
			}
		};

		this.save = function() {
			messages.publish('data', {request: 'set', dataType: 'gradebook', keys: ['students', _this.studentKey(), 'notes'], returnMsg: 'notesSaved', data: _this.notes()});
		};

		this.cancel = function () {
			_this.notes(utilities.clone(_revertNotes));
			messages.publish('view.student.endEdit');
			_this.dirty(false);
		};
	};
});