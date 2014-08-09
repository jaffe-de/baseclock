define(['base/baseItemInfo', 'utilities'],
	function (BaseItemInfo, utilities) {
	return function VMCategoryInfo() {

		BaseItemInfo.call(this, {	
			dataType: 	'MCategory',
			table: 			'categories',
			formId: 		'#category-info-form',
			validatorOptions: {
				rules: {
					name: {
						required: true
					},
					weight: {
						required: true,
						min: 0
					},
					dropHighScoreCount: {
						required: true,
						min: 0
					},
					dropLowScoreCount: {
						required: true,
						min: 0
					}
				},
				errorPlacement: utilities.errorPlacement
				// highlight: _services.utilities.highlight,
				// success: _services.utilities.success				
			},
			messages: {
				itemSelected: 	'categorySelected',
				itemRetrieved: 	'category',
				itemSaved: 			'categorySaved',
				beginEdit: 			'view.category.beginEdit',
				endEdit: 				'view.category.endEdit'
			}
		});

		var _this = this;
	};
});
