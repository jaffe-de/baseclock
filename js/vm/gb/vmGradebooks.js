define(['messages', 'models', 'bootbox', 'utilities'], 
	function (messages, models, bootbox, utilities) {

	return function VMGradebooks() {
		
		var _this = this;
		var _firebase;
		var _autoSelect = true;
		var _newGradebook = null;

		// editing > 0 means edits are pending, should warn client about changing gradbooks
		var _editing = 0;

		// ko viewmodel
		this.gradebooks = ko.observableArray([]);
		this.gradebooks.subscribe(function() {
			if (_autoSelect && _firebase) {
				if (_firebase.user.selectedGradebook !== '') {
					_this.click(_firebase.user.selectedGradebook);
					_autoSelect = false;
				}
			}
		});
		
		this.selectedGradebookKey = ko.observable('');
		this.selectedGradebookKey.subscribe(function(newKey) {
			messages.publish('view.gradebookSelected', {_key: newKey}, 'vmGradebooks:16');
			messages.publish('data', {request: 'update', dataType: 'user', data: {selectedGradebook: newKey}});
		});
		
		// Get the gradebook list when firebase is ready
		messages.subscribe('control.firebaseReady', function(data) {
			_firebase = data.firebase;
			_getGradebooks();
		});
		
		// Process the gradebook list
		messages.subscribe('data.gradebooks', function(gradebooks) {
			_this.gradebooks(utilities.sortOnField(gradebooks.array, ['name']));
		});
		
		// New gradebook pushed
		messages.subscribe('data.gradebookPushed', function(data) {
			_this.click(data.key);
		});
		
		// Editing flag
		messages.subscribe('view.gradebook.beginEdit', function () {
			_editing++;
		});
		
		messages.subscribe('view.gradebook.endEdit', function () {
			_editing--;
		});
		
		_getGradebooks = function () {
			messages.publish('data', {request: 'on', dataType: 'gradebookList', returnMsg: 'gradebooks'}, 'vmGradebooks:_getGradebooks');
		};
		
		// Editing in progress, confirm before selecting or adding another gradebook
		_confirm = function(msg, fn, key) {
			bootbox.confirm(msg, function(result) {
				if (result) {
					_editing = 0;
					fn(key);
				}
			});
		};
		
		// Client selected a gradebook
		this.click = function(key) {
			if (_editing > 0) {
				_confirm('You will lose your edits if you change to another gradebook. Are you sure?', _this.click, key);
			} else {
				_this.selectedGradebookKey(key);
			}
		};
		
		// Add a gradebook
		this.add = function() {
			if (_editing > 0) {
				_confirm('You will lose your edits if you add a new gradebook. Are you sure?', _this.add);
			} else {
				messages.publish('data', {request: 'push', dataType: 'gradebookList', returnMsg: 'gradebookPushed', data: models.newModel("MGradebook")}, 'vmGradebooks:add');
			}
		};
		
		// Delete a gradebook
		this.del = function() {
			bootbox.confirm('Are you sure you want to delete an entire gradebook? This cannot be undone!', function(result) {
				if (result) {
					messages.publish('data', {request: 'remove', dataType: 'gradebookList', keys: [_this.selectedGradebookKey()], returnMsg: 'gradebookRemoved'}, 'vmGradebooks:del');
				}				
			});
		};
	};
});
