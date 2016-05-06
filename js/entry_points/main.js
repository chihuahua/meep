goog.provide('meep.entryPoints.main');


/**
 * The main entry point into the app.
 */
meep.entryPoints.main = function() {
	var element = document.createElement('div');
	element.innerHTML = 'Hello, foobar.' + goog.getCssName('hi');
  element.className = goog.getCssName('mainContent');
	document.body.appendChild(element);
};

meep.entryPoints.main();
