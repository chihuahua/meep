goog.provide('meep.ui.NoMicWidget');

goog.require('meep.ui.Widget');



/**
 * The widget that lets the user know that the mic failed to be retrieved.
 * @param {string} reason The reason that the mic failed to be retrieved.
 * @constructor
 * @extends {meep.ui.Widget}
 */
meep.ui.NoMicWidget = function(reason) {
  var element = document.createElement('div');
  element.className = goog.getCssName('noMicWidget');
  element.innerHTML =
      'I can\'t haz mic for recording. :( ' + reason +
      '<br><img src="images/sadCat.png">';
  meep.ui.NoMicWidget.base(this, 'constructor', element);
};
goog.inherits(meep.ui.NoMicWidget, meep.ui.Widget);
