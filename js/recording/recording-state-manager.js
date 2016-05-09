goog.provide('meep.recording.RecordingStateManager');

goog.require('meep.messaging.Dispatcher');
goog.require('meep.recording.RecordingState');



/**
 * Manages the state of recording - we could be recording, idle, or
 * transitioning between the 2.
 * @param {!MediaStream} mediaStream The media stream used for recording.
 * @constructor
 * @extends {meep.messaging.Dispatcher}
 */
meep.recording.RecordingStateManager = function(mediaStream) {
  /** @private {!MediaStream} */
  this.mediaStream_ = mediaStream;

  /**
   * The current state of recording.
   * @private {meep.recording.RecordingState}
   */
  this.recordingState_ = meep.recording.RecordingState.IDLE;

  meep.recording.RecordingStateManager.base(this, 'constructor');
};
goog.inherits(meep.recording.RecordingStateManager, meep.messaging.Dispatcher);


/**
 * Starts recording if idle. Stops recording (and makes idle) if recording. Does
 * nothing if transitioning.
 */
meep.recording.RecordingStateManager.prototype.toggleRecording = function() {
  if (this.recordingState_ == meep.recording.RecordingState.IDLE) {
    return;
  }
  // TODO: Actually do recording.
  if (this.recordingState_ == meep.recording.RecordingState.RECORDING) {
    this.recordingState_ = meep.recording.RecordingState.IDLE;
  } else if (this.recordingState_ == meep.recording.RecordingState.IDLE) {
    this.recordingState_ = meep.recording.RecordingState.RECORDING;
  }
};


/**
 * @return {meep.recording.RecordingState} The current state of recording.
 */
meep.recording.RecordingStateManager.prototype.getRecordingState = function() {
  return this.recordingState_;
};
