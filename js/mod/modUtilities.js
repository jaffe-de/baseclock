// require(function() {
//   Object.size = function(obj) {
//     var size = 0,
//       key;
//     for (key in obj) {
//       if (obj.hasOwnProperty(key)) {
//         size++;
//       }
//     }
//     return size;
//   };


//   // jQuery plugin: PutCursorAtEnd 1.0
//   // http://plugins.jquery.com/project/PutCursorAtEnd
//   // by teedyay
//   //
//   // Puts the cursor at the end of a textbox/ textarea

//   // codesnippet: 691e18b1-f4f9-41b4-8fe8-bc8ee51b48d4
//   (function($) {
//     jQuery.fn.putCursorAtEnd = function() {
//       return this.each(function() {
//         $(this).focus();

//         // If this function exists...
//         if (this.setSelectionRange) {

//           // ... then use it
//           // (Doesn't work in IE)

//           // Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
//           var len = $(this).val().length * 2;
//           this.setSelectionRange(len, len);
//         } else {
//           // ... otherwise replace the contents with itself
//           // (Doesn't work in Google Chrome)
//           $(this).val($(this).val());
//         }

//         // Scroll to the bottom, in case we're in a tall textarea
//         // (Necessary for Firefox and Google Chrome)
//         this.scrollTop = 999999;
//       });
//     };

//     Object.equals = function(x, y) {
//       if (x === y) return true;
//       // if both x and y are null or undefined and exactly the same

//       if (!(x instanceof Object) || !(y instanceof Object)) return false;
//       // if they are not strictly equal, they both need to be Objects

//       if (x.constructor !== y.constructor) return false;
//       // they must have the exact same prototype chain, the closest we can do is
//       // test there constructor.

//       for (var p in x) {
//         if (!x.hasOwnProperty(p)) continue;
//         // other properties were tested using x.constructor === y.constructor

//         if (!y.hasOwnProperty(p)) return false;
//         // allows to compare x[ p ] and y[ p ] when set to undefined

//         if (x[p] === y[p]) continue;
//         // if they have the same strict value or identity then they are equal

//         if (typeof(x[p]) !== "object") return false;
//         // Numbers, Strings, Functions, Booleans must be strictly equal

//         if (!Object.equals(x[p], y[p])) return false;
//         // Objects and Arrays must be tested recursively
//       }

//       for (p in y) {
//         if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
//         // allows x[ p ] to be set to undefined
//       }
//       return true;
//     };

//   })(jQuery);

//   // Get URL query parameter
//   // Usage: $.QueryString["param"]
//   (function($) {
//     $.QueryString = (function(a) {
//       if (a == "") return {};
//       var b = {};
//       for (var i = 0; i < a.length; ++i) {
//         var p = a[i].split('=');
//         if (p.length != 2) continue;
//         b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
//       }
//       return b;
//     })(window.location.search.substr(1).split('&'))
//   })(jQuery);

//   // Additional jQuery validator methods
//   $.validator.addMethod("time", function(value, element) {
//     return this.optional(element) || /^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/i.test(value);
//   }, "Please enter a valid time.");

//   $.validator.addMethod("validTimeSequence", function(value, element, parms) {
//     var thisDate = new Date('01-01-2012 ' + value);
//     var passedDate = new Date('01-01-2012 ' + $(parms).val());
//     return (thisDate > passedDate);
//   }, "Class ends before it starts!");

//   $.validator.addMethod("validDateSequence", function(value, element, parms) {
//     var thisDate = new Date(value);
//     var passedDate = new Date($(parms).val());
//     return (thisDate > passedDate);
//   }, "Term ends before it starts!");

//   jQuery.fn.outer = function() {
//     return $($('<div></div>').html(this.clone())).html();
//   };

//   $.fn.equals = function(compareTo) {
//     if (!compareTo || this.length != compareTo.length) {
//       return false;
//     }
//     for (var i = 0; i < this.length; ++i) {
//       if (this[i] !== compareTo[i]) {
//         return false;
//       }
//     }
//     return true;
//   };

// }());