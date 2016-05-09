goog.provide('meep.ui.ToggleRecordingWidget');

goog.require('meep.recording.Messages');
goog.require('meep.recording.RecordingState');
goog.require('meep.ui.Widget');


/**
 * The widget used to toggle recording.
 * @param {!meep.recording.RecordingStateManager} recordingStateManager
 * @constructor
 * @extends {meep.ui.Widget}
 */
meep.ui.ToggleRecordingWidget = function(recordingStateManager) {
  var element = document.createElement('a');
  element.className = goog.getCssName('toggleRecordingWidget');
  meep.ui.ToggleRecordingWidget.base(this, 'constructor', element);

  // Initialize button text.
  this.assignTextContent_(recordingStateManager);
  recordingStateManager.listen(meep.recording.Messages.RECORDING_STATE_CHANGED,
      this.assignTextContent_);

  element.addEventListener('click', function(e) {
    e.preventDefault();
    // On being clicked, toggle recording.
    recordingStateManager.toggleRecording();
    return false;
  });
};
goog.inherits(meep.ui.ToggleRecordingWidget, meep.ui.Widget);


/**
 * Changes the content of the widget to match the recording state.
 * @private
 */
meep.ui.ToggleRecordingWidget.prototype.assignTextContent_ = function(
    recordingStateManager) {
  switch (recordingStateManager.getRecordingState()) {
    case meep.recording.RecordingState.IDLE:
      this.getDom().innerHTML = '&#9899; Start recording.';
      break;
    case meep.recording.RecordingState.RECORDING:
      this.getDom().innerHTML = '&#9632; Stop recording.';
      break;
    case meep.recording.RecordingState.TRANSITIONING:
      this.getDom().innerHTML = 'Working ...';
      break;
  }

  this.getDom().setAttribute('data-disabled',
      recordingStateManager.getRecordingState() ==
          meep.recording.RecordingState.TRANSITIONING ? '1' : '0');
};
