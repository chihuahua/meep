goog.provide('meep.ui.Mp3PlayWidget');

goog.require('meep.recording.Messages');
goog.require('meep.ui.Widget');



/**
 * Plays a rendered MP3.
 * @param {!meep.recording.RecordingStateManager} recordingStateManager
 * @constructor
 * @extends {meep.ui.Widget}
 */
meep.ui.Mp3PlayWidget = function(recordingStateManager) {
  /** @private {!meep.recording.RecordingStateManager} */
  this.recordingStateManager_ = recordingStateManager;

  var element = document.createElement('div');
  element.className = goog.getCssName('mp3PlayWidget');

  var audioElement = document.createElement('audio');
  audioElement.setAttribute('controls', '1');
  element.appendChild(audioElement);

  meep.ui.Mp3PlayWidget.base(this, 'constructor', element);

  /**
   * Keys for removing listeners.
   * @private {!Array.<meep.message.ListenerKey>}
   */
  this.keys_ = [
    recordingStateManager.listen(
        meep.recording.Messages.RECORDING_STATE_CHANGED, function() {
          var state = recordingStateManager.getRecordingState();
          if (state == meep.recording.RecordingState.IDLE) {
            audioElement.src = recordingStateManager.getMp3Url();
            element.style.display = 'block';
          } else {
            element.style.display = 'none';
          }
        })
  ];
};
goog.inherits(meep.ui.Mp3PlayWidget, meep.ui.Widget);


/** @override */
meep.ui.Mp3PlayWidget.prototype.cleanUp = function() {
  meep.ui.Mp3PlayWidget.base(this, 'cleanUp');
  for (var i = 0; i < this.keys_.length; ++i) {
    this.recordingStateManager_.removeListenerByKey(this.keys[i]);
  }
};
