goog.provide('meep.recording.RecordingStateManager');

goog.require('meep.messaging.Dispatcher');
goog.require('meep.recording.RecordingState');
goog.require('meep.recording.WorkerMessages');



/**
 * Manages the state of recording - we could be recording, idle, or
 * transitioning between the 2.
 * @param {!MediaStream} mediaStream The media stream used for recording.
 * @constructor
 * @extends {meep.messaging.Dispatcher}
 */
meep.recording.RecordingStateManager = function(mediaStream) {
  var audioContext = meep.recording.RecordingStateManager.AudioContext_;

  /**
   * The web worker that actually processes the PCM data into compressed mp3
   * data.
   * @private {!Worker}
   */
  this.mp3Worker_ = new Worker('js/mp3.js');

  // Initialize the MP3 encoder within the worker.
  this.mp3Worker_.postMessage([meep.recording.WorkerMessages.INITIALIZE_ENCODER,
      // Channel count, sample rate, and bit rate.
      1, audioContext.sampleRate, 128]);

  /**
   * The count of samples in the recording so far.
   * @private {number}
   */
  this.samplesProcessed_ = 0;

  /**
   * The URL of the most recently generated mp3 if any.
   * @private {string}
   */
  this.mp3Url_ = '';

  var self = this;
  this.mp3Worker_.onmessage = function(e) {
    var messageType = e.data[0];
    switch (messageType) {
      case meep.recording.WorkerMessages.DATA_PROCESSED:
        self.samplesProcessed_ += e.data[1];
        break;
      case meep.recording.WorkerMessages.RECORDING_COMPLETED:
        // TODO: Create a link for downloading the URL.
        self.mp3Url_ = e.data[1];
        goog.global.console.log(self.mp3Url_);
        break;
    }
  };

  /** @private {!MediaStreamAudioSourceNode} */
  this.mediaStreamAudioSourceNode_ =
      audioContext.createMediaStreamSource(mediaStream);

  /**
   * Script processor node used to obtain PCM audio data.
   * @private {!ScriptProcessorNode}
   */
  this.scriptProcessorNode_ =
      audioContext.createScriptProcessor(undefined, 1, 1);
  this.scriptProcessorNode_.connect(audioContext.destination);

  // On obtaining audio data,
  var self = this;
  this.scriptProcessorNode_.onaudioprocess = function(e) {
    // We only get 1 channel of data.
    var rawData = e.inputBuffer.getChannelData(0);
    var clampedData = new Int16Array(rawData.length);
    var clampCeiling = 32767;
    var clampFloor = 0 - clampCeiling;
    for (var i = 0; i < rawData.length; ++i) {
      var clampedValue = 0;
      if (rawData[i] > 0) {
        clampedValue = rawData[i] * clampCeiling;
        if (clampedValue > clampCeiling) {
          clampedValue = clampCeiling;
        }
      } else if (rawData[i] < 0) {
        clampedValue = rawData[i] * clampFloor;
        if (clampedValue < clampFloor) {
          clampedValue = clampFloor;
        }
      }
      clampedData[i] = clampedValue;
    }

    self.mp3Worker_.postMessage(
        [meep.recording.WorkerMessages.MORE_AUDIO_DATA, clampedData.buffer],
        clampedData.buffer);
  };

  /**
   * The current state of recording.
   * @private {meep.recording.RecordingState}
   */
  this.recordingState_ = meep.recording.RecordingState.IDLE;

  meep.recording.RecordingStateManager.base(this, 'constructor');
};
goog.inherits(meep.recording.RecordingStateManager, meep.messaging.Dispatcher);


/**
 * The global audio context.
 * @private {!AudioContext}
 */
meep.recording.RecordingStateManager.AudioContext_ = new AudioContext();


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
    this.recordingState_ = meep.recording.RecordingState.TRANSITIONING;
    // Disconnect the source node on stopping.
    this.mediaStreamAudioSourceNode_.disconnect();
    // Tell the worker to stop recording.
    this.mp3Worker_.postMessage([meep.recording.WorkerMessages.STOP_RECORDING]);
    // this.recordingState_ = meep.recording.RecordingState.IDLE;
  } else if (this.recordingState_ == meep.recording.RecordingState.IDLE) {
    // We are currently idle. Begin recording.
    this.recordingState_ = meep.recording.RecordingState.RECORDING;
    this.samplesProcessed_ = 0;
    this.mediaStreamAudioSourceNode_.connect(this.scriptProcessorNode_);

    // Clean up the former URL.
    if (this.mp3Url_) {
      goog.global.URL.revokeObjectURL(this.mp3Url_);
    }
  }
};


/**
 * @return {number} The seconds into recording.
 */
meep.recording.RecordingStateManager.prototype.getRecordingTime = function() {
  return this.samplesProcessed_ /
      meep.recording.RecordingStateManager.AudioContext_.sampleRate;
};


/**
 * @return {meep.recording.RecordingState} The current state of recording.
 */
meep.recording.RecordingStateManager.prototype.getRecordingState = function() {
  return this.recordingState_;
};
