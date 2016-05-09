goog.provide('meep.ui.MicRequestingWidget');

goog.require('meep.ui.Widget');



/**
 * The widget responsible for requesting microphone permissions.
 * @constructor
 * @extends {meep.ui.Widget}
 */
meep.ui.MicRequestingWidget = function() {
  var element = document.createElement('div');
  element.className = goog.getCssName('micRequestingWidget');
  element.innerHTML = 'Please let this app use your mic for recording MP3s.' +
      '<br><img src="images/plzCat.png">';

  meep.ui.MicRequestingWidget.base(this, 'constructor', element);

  goog.global.navigator['getUserMedia'] =
      goog.global.navigator['getUserMedia'] ||
      goog.global.navigator.webkitGetUserMedia;
};
goog.inherits(meep.ui.MicRequestingWidget, meep.ui.Widget);


/**
 * Requests mic permissions from the user.
 * @param {function(!MediaStream)} onSuccess The success callback. Takes the
 *     media stream for recording.
 * @param {function(string)} onFailure The failure callback. Accepts a failure
 *     string.
 */
meep.ui.MicRequestingWidget.prototype.requestMicPermissions = function(
    onSuccess, onFailure) {
  goog.global.navigator['getUserMedia']({'audio': true}, function(mediaStream) {
    if (mediaStream) {
      onSuccess(mediaStream);
    } else {
      onFailure('An error occurred while obtaining the microphone.');
    }
  }, function() {
    onFailure('The user denied microphone permissions.');
  });
};
