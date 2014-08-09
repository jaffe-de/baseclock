//	Revision history
// 	2012-11-01	Written
//
define(['messages', 'mod/modLoadGbViewModels', 'mod/modLoadGbTables'],
  function(messages) {

    return {

      init: function() {
        messages.subscribe('control.firebaseReady', function() {
          $('.content-container').removeClass('hide-on-startup');
        });
        $('.container').removeClass('hide-on-startup');
        $('.datepicker').datepicker({
          changeYear: true,
          dateFormat: 'mm/dd/yy'
        });
      }

    };

  });