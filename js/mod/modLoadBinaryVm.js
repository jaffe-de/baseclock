define([
	'knockout',
	'vm/vmFooter',
	'vm/vmHeader',
	'vm/vmControl',
	'vm/vmBinaryLEDs'
], function (
	ko,
	VMFooter,
	VMHeader,
	VMControl,
	VMBinaryLEDs
) {
	ko.applyBindings(new VMFooter(), document.getElementById('footer'));
	ko.applyBindings(new VMHeader(), document.getElementById('header'));
	ko.applyBindings(new VMControl(), document.getElementById('view-control'));
	ko.applyBindings(new VMBinaryLEDs(), document.getElementById('view-binary-leds'));
});

