var require = {
	baseUrl: 'js',
	paths: {
		'domReady': 'lib/require/domReady',
		'models': 'svc/svcModels',
		'firebase': 'svc/svcFirebase',
		'Firebase': 'https://cdn.firebase.com/v0/firebase-debug',
		// 'Firebase': 'svc/svcFirebaseLocal',
		'login': 'svc/svcLogin',
		'messages': 'svc/svcMessages',
		'progressReport': 'svc/svcProgressReport',
		'underscore': 'lib/underscore/underscore',
		'constants': 'svc/svcConstants',
		'logger': 'svc/svcLogger',
		'utilities': 'svc/svcUtilities',
		'moment': 'lib/moment/moment.min',
		'bootbox': 'lib/bootstrap/bootbox.min',
		'baseIncludeCheckbok': 'base/baseIncludeCheckbox',
		'baseItemArray': 'base/baseItemArray',
		'baseItemInfo': 'base/baseItemInfo'
	},
	
	shim: {
		'Firebase': {
			exports: 'Firebase'
		},
		'bootbox': {
			exports: 'bootbox'
		},
		'underscore': {
			exports: '_'
		}
	},
	
	deps: ['mod/modUtilities', 'mod/modLoadTemplates'],
	callback: function () {
	}
	// urlArgs: "bust"
};

