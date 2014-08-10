define(['messages'], function(messages) {

  var SvcClock = function() {

  	var _interval = 1000;
    var _this = this;
    var _pause = false;
    var _time;

    setInterval(function() {
    	if (!_pause) {
	    	var dt = new Date();
	    	_time = dt.getTime();
	    	messages.publish('clock.update', {
	    		hour: dt.getHours(),
	    		minute: dt.getMinutes(),
	    		second: dt.getSeconds()
	    	});
	    }
    	$('.hide-on-startup').show();
    }, _interval);

    messages.subscribe('clock.pause', function () {
    	_pause = !_pause;
    });

  };

  return new SvcClock();
});