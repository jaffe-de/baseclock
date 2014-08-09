define(['messages', 'bootbox', 'utilities', 'models'], function(messages, bootbox, utilities, models) {
	
	return function VMClasses() {

		var _this = this;
		var _editing = 0;
		
		this.classes = ko.observable([]);
		this.selectedClassKey = ko.observable('');
		this.selectedClassKey.subscribe(function(key) {
			_editing = 0;
			messages.publish('view.classSelected', {key: key});
		});

		// Gradebook selected
		// messages.subscribe('view.gradebookReady', function(data) {
		// 	messages.publish('data', {request: 'on', dataType: 'gradebook', keys: ['classes'], returnMsg: 'classes'});
		// });
		
		// Class list loaded
		messages.subscribe('data.classes', function (data) {			
			_this.classes(utilities.sortOnField(data.array, ['period','name']));
		});
		
		// New class was added
		messages.subscribe('data.pushClass', function(data) {
			_this.selectedClassKey(data.key);
		});
		
		messages.subscribe('data.classRemoved', function(data) {
			_this.selectedClassKey('');
		});
		
		// Listen for editing messages from VMs that edit classes
		messages.subscribe('view.class.beginEdit', function(data) {
			_editing++;
		});
		messages.subscribe('view.class.endEdit', function(data) {
			_editing = Math.max(0, _editing-1);
		});
		
		this.click = function (key) {
			if (_editing > 0) {
				bootbox.confirm('The changes to this class will be lost if you select another class.  Are you sure?', function(result) {
					if (result) {
						_editing = 0;
						_this.click(key);
					}
				});
			} else {				
				_this.selectedClassKey(key);
			}
		};
		
		this.add = function() {
			if (_editing > 0) {
				bootbox.confirm('The changes to this class will be lost if you add a class.  Are you sure?', function(result) {
					if (result) {
						_editing = 0;
						_this.add();
					}
				});
			} else {
				messages.publish('data', {request: 'push', dataType: 'gradebook', keys: ['classes'], data: models.newModel('MClass'), returnMsg: 'pushClass'});
			}
		};
		
		this.del = function() {
			bootbox.confirm('Are you sure you want to delete this class? This cannot be undone', function(result) {
				if (result) {
					messages.publish('data', {request: 'remove', dataType: 'gradebook', keys: ['classes', _this.selectedClassKey()], returnMsg: 'classRemoved'});
				}
			});
		};
	};
});

