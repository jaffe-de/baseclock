//	Revision history
// 	2012-11-01	Written
//
define(['constants'], function (constants) {

	var debugLog = true;
	var debugStack = true;

	var log = function (message, vm, args) {
		if (debugLog) {			
			if(typeof console == "object"){
				var _vm = (vm) ? vm : 'Unknown';
				console.log(message+' ('+_vm+') ');
				if (args) {
					console.log('args:');
					console.log(args);
				} else {
					console.log('No arguments');
				}
				if (debugStack) {
					console.trace();
				}
				console.log('-----------------------------------');
			}
		}
	};
	return {
		log: log
	};

});


