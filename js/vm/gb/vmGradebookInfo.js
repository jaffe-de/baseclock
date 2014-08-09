define(
	['utilities', 'messages', 'models'], function(utilities, messages, models) {

	return function VMGradebookInfo() {

		var _this = this;
		var _revert;
		this.gradebook = ko.observable(ko.mapping.fromJS(models.newModel('MGradebook')));
		this.visible = ko.observable(false);
		this.dirty = ko.observable(false);
		
		messages.subscribe('view.gradebookSelected', function(data) {
			messages.publish('data', {request: 'once', dataType: 'gradebookList', keys: [data._key], returnMsg: 'gradebook'}, 'vmGradebookInfo:13');
		});
		
		messages.subscribe('data.gradebook', function (data) {
			_this.gradebook(data.object);
			_revert = utilities.clone(data.object);
			_this.dirty(false);
			_this.visible(true);			
		});
		
		messages.subscribe('data.gradebookRemoved', function(data) {
			_this.visible(false);
		});
		
		this.save = function() {
			messages.publish('view.gradebook.endEdit');
			var gb = ko.mapping.toJS(_this.gradebook());
			_revert = utilities.clone(gb);
			_this.dirty(false);
			messages.publish('data', {request: 'set', dataType: 'gradebookList', keys: [gb._key], data: gb});
		};
		
		this.cancel = function() {
			_this.gradebook(ko.mapping.fromJS(_revert));
			messages.publish('view.gradebook.endEdit');
			_this.dirty(false);
		};
		
		this.change = function() {
			if (!_this.dirty()) {
				messages.publish('view.gradebook.beginEdit', undefined, 'vmGradebookInfo:change');
				_this.dirty(true);
			}
		};		
	};
});

