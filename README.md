# meep

meep is a simple app that uses gulp for building. It records mono audio and compresses to mp3 data on the fly in a web worker (to free up the UI thread). Since we only store compressed audio data, we can record for hours.

## Setup

`cd` into the repo home dir and call `npm install` to install gulp plugins meep depends on. Then run `mkdir build/css build/js` so the build command can find them.

## Building

Running `gulp` builds minified `build/js/m.js`.

## Serving for local development

Running `gulp server` starts a dev server on port 3000, so visit http://127.0.0.1:3000/

