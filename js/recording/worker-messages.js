goog.provide('meep.recording.WorkerMessages');


/**
 * Messages sent to the web worker.
 * @enum {number}
 */
meep.recording.WorkerMessages = {
  // Contains PCM data as 2nd arg.
  MORE_AUDIO_DATA: 1,

  // Command for worker to stop recording.
  STOP_RECORDING: 2,

  // Message from worker on how more data was processed. Size as 2nd arg.
  DATA_PROCESSED: 3,

  // Message from worker on how recording has completed. URL of mp3 as second
  // argument.
  RECORDING_COMPLETED: 4,

  // Command from main to worker for initializing the mp3 encoder. Args are
  // channel count, sample rate, and bit rate.
  INITIALIZE_ENCODER: 5
};
