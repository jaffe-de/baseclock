define(['base/baseItemArray', 'messages'], 
	function (BaseItemArray, messages) {

	return function VMGradeSystemScale() {

		BaseItemArray.call(this, {
			dataType: 							'MGradeScaleItem',
			table: 									'classes',
			field: 									'scale',
			messages: {
				selectedItem:					'view.classSelected',
				itemRetrieved: 				'class',
				beginEdit: 						'view.class.beginEdit',
				endEdit: 							'view.class.endEdit',
				saved: 								'gradeScaleSaved'
			}			
		});

		var _this = this;

		this.errorText = ko.observable('');
		this.error = ko.observable(false);
		
		messages.subscribe('data.gradeScaleSaved', function(err) {
			if (!err.error) {
				messages.publish('view.class.endEdit');
				_this.dirty(false);
			}
		});
		
		this.clearErrors = function () {
			_this.errorText('');
			_this.error(false);
		};
		
		this.validate = function(_array) {
			var errors = {
				noZero: false,
				names: false,
				values: false
			};
			$.each(_array, function(i, el) {
				// Check that all values and names are filled out
				errors.values = errors.values || (isNaN(parseFloat(el.minScore)));
				errors.names = errors.names || !el.grade || (el.grade && (el.grade.length === 0));
			});
			// Check that the last element has a minScore of 0
			errors.noZero = parseFloat(_array[_array.length-1].minScore) !== 0;
			var _errorText = '';
			_errorText += (errors.names) ? 'Grades are required<br/>' : '';
			_errorText += (errors.values) ? 'Values are required<br/>' : '';
			_errorText += (errors.noZero) ? 'The last value must be 0<br/>' : '';
			_this.errorText(_errorText);
			_this.error(errors.noZero || errors.names || errors.values);
			return !_this.error();
		};		

		this.$cancel = this.cancel;
		this.cancel = function () {
			_this.$cancel();
			_this.clearErrors();
		};
		
		this.beforeSave = function () {
			_this.array.sort(function (a, b) {
				return (parseFloat(a.minScore) < parseFloat(b.minScore)) ? 1 : (parseFloat(a.minScore) > parseFloat(b.minScore)) ? -1 : 0;
			});			
		};
		
		// this.$save = this.save;
		// this.save = function() {
		// 	var arr = ko.mapping.toJS(_this.array);
		// 	if (_this.validate && _this.validate(arr)) {
		// 		messages.publish('data', {request: 'set', dataType: 'gradebook', keys: ['classes', _this.itemKey(), 'scale'], returnMsg: 'gradeScaleSaved', data: arr});
		// 	}
		// };
	};
});
