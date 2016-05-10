goog.provide('meep.entryPoints.main');

goog.require('meep.recording.RecordingStateManager');
goog.require('meep.ui.MicRequestingWidget');
goog.require('meep.ui.Mp3PlayWidget');
goog.require('meep.ui.NoMicWidget');
goog.require('meep.ui.ToggleRecordingWidget');


/**
 * The main entry point into the app.
 */
meep.entryPoints.main = function() {
	var micRequestingWidget = new meep.ui.MicRequestingWidget();
  var noMicWidget;
  micRequestingWidget.requestMicPermissions(function(mediaStream) {
    // The user gave us mic permissions.
    micRequestingWidget.cleanUp();
    if (noMicWidget) {
      noMicWidget.cleanUp();
    }

    // Tell the user about the app.
    var description = document.createElement('p');
    description.innerHTML = 'This app records MP3s. It compresses audio data ' +
        'live in a web worker, allowing UI animations to be smooth. This ' +
        'also means that we can record hours of audio - we only store the ' +
        'compressed audio data.';
    document.body.appendChild(description);

    var recordingStateManager =
        new meep.recording.RecordingStateManager(mediaStream);

    // Create a button for toggling recording.
    var toggleRecordingWidget =
        new meep.ui.ToggleRecordingWidget(recordingStateManager);
    document.body.appendChild(toggleRecordingWidget.getDom());

    // Create a widget for playing recorded MP3s.
    var playWidget = new meep.ui.Mp3PlayWidget(recordingStateManager);
    document.body.appendChild(playWidget.getDom());
  }, function(reason) {
    // Microphone permissions denied ... or failed to obtain mic.
    var noMicWidget = new meep.ui.NoMicWidget(reason);
    document.body.appendChild(noMicWidget.getDom());
    micRequestingWidget.cleanUp();
  });
  document.body.appendChild(micRequestingWidget.getDom());
};


meep.entryPoints.main();
