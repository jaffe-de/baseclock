define([], function() {

  var SvcUtilities = function() {

    var _this = this;
    this.leadingZero = function (n, _p) {
    	var p = _p | 2;
    	var len = (''+n).length;
    	var pad = '';
    	for (var i=0; i<p-len; i++) {
    		pad += '0';
    	}
    	return pad + n;
    };

  };

  return new SvcUtilities();
});