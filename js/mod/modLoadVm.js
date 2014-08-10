define([
	'knockout',
	'vm/vmFooter',
	'vm/vmHeader',
	'vm/vmDecimal',
	'vm/vmControl',
	'vm/vmBinary',
	'vm/vmOctal',
	'vm/vmHex',
	'vm/vmBinaryLEDs'
], function (
	ko,
	VMFooter,
	VMHeader,
	VMDecimal,
	VMControl,
	VMBinary,
	VMOctal,
	VMHex,
	VMBinaryLEDs
) {
	ko.applyBindings(new VMFooter(), document.getElementById('footer'));
	ko.applyBindings(new VMHeader(), document.getElementById('header'));
	ko.applyBindings(new VMDecimal(), document.getElementById('view-decimal'));
	ko.applyBindings(new VMControl(), document.getElementById('view-control'));
	ko.applyBindings(new VMBinary(), document.getElementById('view-binary'));
	ko.applyBindings(new VMOctal(), document.getElementById('view-octal'));
	ko.applyBindings(new VMHex(), document.getElementById('view-hex'));
	ko.applyBindings(new VMBinaryLEDs(), document.getElementById('view-binary-leds'));
});

