define(['knockout', 'constants'], function (ko, constants) {
	
	return function vmFooter() {
		this.version = ko.observable(constants.version);
		this.copyrightYear = ko.observable(constants.copyrightYear);
		this.author = ko.observable(constants.author);
		this.webpage = ko.observable(constants.webpage);		
	};
});
