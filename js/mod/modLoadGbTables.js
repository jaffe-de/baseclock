// Load the students, classes, and categories tables here rather than load it
// from all the VMs that need it.
define(['messages'], function (messages) {
	messages.subscribe('view.gradebookReady', function(data) {
		messages.publish('data', {request: 'on', dataType: 'gradebook', keys: ['students'], returnMsg: 'students'});
    messages.publish('data', {request: 'on', dataType: 'gradebook', keys: ['classes'], returnMsg: 'classes'});
    messages.publish('data', {request: 'on', dataType: 'gradebook', keys: ['categories'], returnMsg: 'categories'});
    messages.publish('data', {request: 'on', dataType: 'gradebook', keys: ['assignments'], returnMsg: 'assignmentsForPR'});
    messages.publish('data', {request: 'on', dataType: 'gradebook', keys: ['items'], returnMsg: 'items'});
    messages.publish('data', {request: 'on', dataType: 'gradebook', keys: ['items'], returnMsg: 'itemsForPR'});
    // messages.publish('data', {request: 'on', dataType: 'gradebook', keys: ['scheduleNames'], returnMsg: 'scheduleNames'});
	});
});

