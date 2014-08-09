define(['utilities', 'messages', 'models', 'bootbox'], function(utilities, messages, models, bootbox) {

	return function VMAssignments() {
		
		var _this = this;
		var _editing = 0;
		var _gradebook = {};
		
		this.categories = ko.observable([]);
		this.selectedCategory = ko.observable();
		this.selectedCategory.subscribe(function(catId) {
			messages.publish('data', {request: 'on', dataType: 'gradebook', keys: ['assignments'], priority: catId, returnMsg: 'assignments'});
			messages.publish('view.assignment.newCategory', {newCategory: catId});
		});
		this.assignments = ko.observableArray([]);
		this.selectedAssignmentKey = ko.observable('');
		this.selectedAssignmentKey.subscribe(function(key) {
			_editing = 0;
			messages.publish('view.assignmentSelected', {key: key});
		});

		// Gradebook selected
		messages.subscribe('view.gradebookReady', function(data) {
			messages.publish('data', {request: 'on', dataType: 'gradebook', keys: ['categories'], returnMsg: 'categories'});
		});
		
		// Selected gradebook information
		messages.subscribe('data.gradebook', function (data) {
			_gradebook = data.object;
		});

		// Category list loaded
		messages.subscribe('data.categories', function (data) {
			_this.categories(utilities.sortOnField(data.array, ['name']));
		});
		
		// Assignment list loaded
		messages.subscribe('data.assignments', function (data) {
			_this.assignments(utilities.sortOnField(data.array, ['date'], true));
		});
		
		// New assignment was added
		messages.subscribe('data.pushAssignment', function(data) {
			_this.selectedAssignmentKey(data.key);
		});
		
		// Listen for editing messages from VMs that edit assignments
		messages.subscribe('view.assignment.beginEdit', function(data) {
			_editing++;
		});
		messages.subscribe('view.assignment.endEdit', function(data) {
			_editing = Math.max(0, _editing-1);
		});
		
		// Editing in progress, confirm before selecting or adding another assignment
		_confirm = function(msg, fn, key) {
			bootbox.confirm(msg, function(result) {
				if (result) {
					_editing = 0;
					fn(key);
				}
			});
		};
		
		this.assignmentDescription = function(assignment) {
			return utilities.dateToFormatDate(new Date(assignment.date)) + ' ' + assignment.name;
		};
		
		this.click = function (key) {
			if (_editing > 0) {
				bootbox.confirm('The changes to this assignment will be lost if you select another assignment.  Are you sure?', function(result) {
					if (result) {
						_editing = 0;
						_this.click(key);
					}
				});
			} else {				
				_this.selectedAssignmentKey(key);
			}
		};
		
		this.add = function() {
			if (_editing > 0) {
				bootbox.confirm('The changes to this assignment will be lost if you add an assignment.  Are you sure?', function(result) {
					if (result) {
						_editing = 0;
						_this.add();
					}
				});
			} else {
				var a = models.newModel('MAssignment');
				a.category = _this.selectedCategory();
				a.outOf = _gradebook.defaultMaxScore;
				messages.publish('data', {request: 'push', dataType: 'gradebook', keys: ['assignments'], data: a, priority: a.category, returnMsg: 'pushAssignment'});
			}
		};
		
		this.del = function() {
			bootbox.confirm('Are you sure you want to delete this category? This cannot be undone', function(result) {
				if (result) {
					messages.publish('data', {request: 'remove', dataType: 'gradebook', keys: ['assignments', _this.selectedAssignmentKey()]});
				}
			});
		};
	};
});

