/**
 * @fileoverview This is the entry point into the web worker.
 */
goog.provide('meep.entryPoints.mp3Worker');

goog.require('meep.recording.WorkerMessages');


meep.entryPoints.mp3Worker = function() {
  goog.global.importScripts('../lame.js');

  var ljs = new lamejs();

  /** @type {?lamejs.Mp3Encoder} */
  var mp3Encoder = null;

  /** An array of array buffers ready to be encoded. */
  var mp3Bytes = [];

  var channelCount = 0;
  var sampleRate = 0;
  var bitRate = 0;

  goog.global.onmessage = function(e) {
    var messageType = e.data[0];
    switch (messageType) {
      case meep.recording.WorkerMessages.INITIALIZE_ENCODER:
        channelCount = e.data[1];
        sampleRate = e.data[2];
        bitRate = e.data[3];
        mp3Encoder = new ljs['Mp3Encoder'](channelCount, sampleRate, bitRate);
        break;
      case meep.recording.WorkerMessages.MORE_AUDIO_DATA:
        if (!mp3Encoder) {
          throw 'No encoder!';
        }
        var dataArrayBuffer = e.data[1];
        var dataInt16 = new Int16Array(dataArrayBuffer);
        mp3Bytes.push(mp3Encoder.encodeBuffer(dataInt16).buffer);
        goog.global.postMessage(
            [meep.recording.WorkerMessages.DATA_PROCESSED, dataInt16.length]);
        break;
      case meep.recording.WorkerMessages.STOP_RECORDING:
        // Add in the last bytes.
        var flushedData = mp3Encoder.flush().buffer;
        mp3Bytes.push(flushedData);

        // Create a blob of mp3 file data.
        var url = goog.global.URL.createObjectURL(
            new Blob(mp3Bytes, {'type': 'audio/mpeg'}));
        mp3Bytes.length = 0;

        // Reset recording.
        mp3Encoder = new ljs['Mp3Encoder'](channelCount, sampleRate, bitRate);
        goog.global.postMessage(
            [meep.recording.WorkerMessages.RECORDING_COMPLETED, url]);
        break;
    }
  };
};

meep.entryPoints.mp3Worker();
