goog.provide('meep.entryPoints.main');


/**
 * The main entry point into the app.
 */
meep.entryPoints.main = function() {
	var element = document.createElement('div');
	element.innerHTML = 'Hello, foobar.';
	document.body.appendChild(element);
};

meep.entryPoints.main();
