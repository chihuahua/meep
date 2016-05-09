goog.provide('meep.messaging.Dispatcher');
goog.provide('meep.message.MessageType');

goog.require('meep.utility.CleanUpable');
goog.require('meep.utility.IdGenerator');



/**
 * A dispatcher dispatches messages that other entities listen and react to.
 * @constructor
 * @implements {meep.utility.CleanUpable}
 */
meep.messaging.Dispatcher = function() {
  /**
   * A mapping from message type to listener key -> callbacks to be run when the
   * message is dispatched.
   * @private {!Object.<
   *     meep.message.MessageType,
   *     !Object.<meep.message.ListenerKey, !Function>>}
   */
  this.messageToListenerKey_ = {};

  /**
   * A mapping from listener key to message type. This allows for efficient
   * removal later.
   * @private {!Object.<meep.message.ListenerKey, meep.message.MessageType>}
   */
  this.listenerKeyToMessage_ = {};
};


/** @typedef {number} */
meep.message.MessageType;


/** @typedef {string} */
meep.message.ListenerKey;


/**
 * Allows some other entity to listen to when this entity dispatches a message
 * of a certain time and register a callback to be run every that type of
 * message is dispatched by this entity.
 * @param {meep.message.MessageType} messageType The type of message to listen
 *     to.
 * @param {function(!meep.messaging.Dispatcher)} callback The callback to run
 *     when the message is dispatched by this entity. Accepts this dispatcher.
 * @return {meep.message.ListenerKey} A key that can be later used to stop
 *     listening.
 */
meep.messaging.Dispatcher.prototype.listen = function(messageType, callback) {
  var listenerKey = '' + meep.utility.IdGenerator.getInstance().generateId();
  this.listenerKeyToMessage_[listenerKey] = messageType;
  if (!this.messageToListenerKey_[messageType]) {
    this.messageToListenerKey_[messageType] = {};
  }
  this.messageToListenerKey_[messageType][listenerKey] = callback;
  return listenerKey;
};


/**
 * Dispatches a message. Runs all callbacks registered for that message on this
 * entity.
 * @param {meep.message.MessageType} messageType The type of message to
 *     dispatch.
 */
meep.messaging.Dispatcher.prototype.dispatch = function(messageType) {
  var listeners = this.messageToListenerKey_[messageType];
  if (!listeners) {
    return;
  }
  for (var listenerKey in listeners) {
    listeners[listenerKey](this);
  }
};


/**
 * Removes a listener by its listener key.
 * @param {meep.message.ListenerKey} listenerKey The key of the listener to
 *     remove.
 */
meep.messaging.Dispatcher.prototype.removeListenerByKey = function(
    listenerKey) {
  var messageType = this.listenerKeyToMessage_[listenerKey];
  if (messageType === undefined) {
    return;
  }

  var callbacks = this.messageToListenerKey_[messageType];
  if (!callbacks[listenerKey]) {
    return;
  }

  delete this.listenerKeyToMessage_[listenerKey];
  delete callbacks[listenerKey];
};


/**
 * If a subclass must clean up state after its life time, do so by overriding
 * this method.
 * @override
 */
meep.messaging.Dispatcher.prototype.cleanUp = function() {};
