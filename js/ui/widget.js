goog.provide('meep.ui.Widget');

goog.require('meep.messaging.Dispatcher');



/**
 * This is a generic item in the UI.
 * @param {!Element} element The root element for this widget.
 * @constructor
 * @extends {meep.messaging.Dispatcher}
 */
meep.ui.Widget = function(element) {
  /**
   * @private {!Element}
   */
  this.element_ = element;
};
goog.inherits(meep.ui.Widget, meep.messaging.Dispatcher);


/**
 * @return {!Element} The root element.
 */
meep.ui.Widget.prototype.getDom = function() {
  return this.element_;
};


/**
 * When the widget is cleaned up, make sure it is not in the DOM.
 * @override
 */
meep.ui.Widget.prototype.cleanUp = function() {
  this.element_.remove();
};
