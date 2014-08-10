define(['logger', 'jquery'], function(logger, $) {

  var SvcMessages = function() {
    var _this = this;
    var _messages = {};

    var Message = function() {
      this.listeners = [];
      return this;
    };

    var Listener = function(listenerFcn) {
      this.listenerFcn = listenerFcn;
      return this;
    };

    // Register a message
    // Input:    
    //   messageStr: (str) Message to register
    // Returns Message object (defined above)
    _register = function(messageStr) {
      var message = new Message();
      _messages[messageStr] = message;
      return message;
    };

    this.getMessages = function() {
      return _messages;
    };

    // Subscribe to a message with a callback function which is
    // fired when the message is sent
    // Inputs:
    //   msgStr:        Message string to listen for
    //   listenerFcn:   Callback function
    // Returns:
    //   obj.msgStr:    The message string
    //   obj.listener:  Ths listener object that's been saved
    this.subscribe = function(msgStr, listenerFcn) {
      if (!_messages[msgStr]) {
        _register(msgStr);
      }
      var listener = new Listener(listenerFcn);
      _messages[msgStr].listeners.push(listener);
      return {
        msgStr: msgStr,
        listener: listener
      };
    };

    // Unsubscribe a message so the callback is removed from the queue
    // Inputs:
    //   obj: Object returned from the subscribe function
    // Returns void
    this.unsubscribe = function(obj) {
      var listeners = _messages[obj.msgStr].listeners;
      $.each(listeners, function(i, l) {
        if (l === obj.listener) {
          listeners.splice(i, 1);
          return false;
        }
      });
      if (listeners.length === 0) {
        delete _messages[obj.msgStr];
      }
    };

    // Notify subscribers with a message
    // Inputs:
    //   messageStr:      Message to notify subscribers
    //   args:            Parameters to pass to subscribers
    // Returns:
    //   messageStr:      Message string
    this.publish = function(messageStr, args, vm) {
      var _args = args;
      logger.log('**    Message:    ' + messageStr, vm, args);
      if (_messages[messageStr]) {
        var count = _messages[messageStr].listeners.length;
        $.each(_messages[messageStr].listeners, function(i, listener) {
          listener.listenerFcn(_args);
        });
      }
      return messageStr;
    };

  };

  return new SvcMessages();

});