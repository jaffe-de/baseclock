define(['base/baseIncludeCheckbox'], function(BaseIncludeCheckbox) {

	return function VMCategoriesInClass() {

		BaseIncludeCheckbox.call(this, {	
			item1Table: 						'classes',
			item2Table: 						'categories',
			includeField: 					'categories',
			sortOnFields: 						['name'],
			messages: {
				item1Selected: 				'classSelected',
				item1Received:				'class',
				item2Received:				'categoryInClass',
				beginEdit: 						'view.class.beginEdit',
			 	endEdit: 							'view.class.endEdit',
				savedMsg: 						'includeCategorySaved'
			}
		});

		var _this = this;

		var _totalPercentage = function() {
			var weights = {};
			var total = 0;
			if (_this.item2() && (_this.item2().length>0) && _this.item1List() && (_this.item1List().length>0)) {
				$.each(_this.item2(), function (i, item) {
					weights[item._key] = item.weight;
				});
				$.each(_this.item1List(), function (i, _key) {
					if (weights[_key]) {
						total += parseFloat(weights[_key]);
					}
				});
			}
			return total;
		};

		this.caption = ko.computed(function () {
			return 'Categories in class (Total percentage is '+_totalPercentage()+'%)';
		}, _this);
	};	
});

