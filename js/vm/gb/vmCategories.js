define(['messages', 'bootbox', 'utilities', 'models'], function(messages, bootbox, utilities, models) {
	
	return function VMCategories() {

		var _this = this;
		var _editing = 0;
		
		this.categories = ko.observable([]);
		this.selectedCategoryKey = ko.observable('');
		this.selectedCategoryKey.subscribe(function(key) {
			_editing = 0;
			messages.publish('view.categorySelected', {key: key});
		});

		// Gradebook selected
		// messages.subscribe('view.gradebookReady', function(data) {
		// 	messages.publish('data', {request: 'on', dataType: 'gradebook', keys: ['categories'], returnMsg: 'categories'});
		// });
		
		// Category list loaded
		messages.subscribe('data.categories', function (data) {			
			_this.categories(utilities.sortOnField(data.array, ['name']));
		});
		
		// New category was added
		messages.subscribe('data.pushCategory', function(data) {
			_this.selectedCategoryKey(data.key);
		});
		
		// Listen for editing messages from VMs that edit gradebooks
		messages.subscribe('view.category.beginEdit', function(data) {
			_editing++;
		});
		messages.subscribe('view.category.endEdit', function(data) {
			_editing = Math.max(0, _editing-1);
		});
		
		// Editing in progress, confirm before selecting or adding another gradebook
		_confirm = function(msg, fn, key) {
			bootbox.confirm(msg, function(result) {
				if (result) {
					_editing = 0;
					fn(key);
				}
			});
		};
		
		this.click = function (key) {
			if (_editing > 0) {
				bootbox.confirm('The changes to this category will be lost if you select another category.  Are you sure?', function(result) {
					if (result) {
						_editing = 0;
						_this.click(key);
					}
				});
			} else {				
				_this.selectedCategoryKey(key);
			}
		};
		
		this.add = function() {
			if (_editing > 0) {
				bootbox.confirm('The changes to this category will be lost if you add a category.  Are you sure?', function(result) {
					if (result) {
						_editing = 0;
						_this.add();
					}
				});
			} else {
				messages.publish('data', {request: 'push', dataType: 'gradebook', keys: ['categories'], data: models.newModel('MCategory'), returnMsg: 'pushCategory'});
			}
		};
		
		this.del = function() {
			bootbox.confirm('Are you sure you want to delete this category? This cannot be undone', function(result) {
				if (result) {
					messages.publish('data', {request: 'remove', dataType: 'gradebook', keys: ['categories', _this.selectedCategoryKey()]});
				}
			});
		};
	};
});

