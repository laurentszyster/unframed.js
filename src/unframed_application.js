/* unframed.js */

/**
 * Link a listener to a name of event messages.
 */
function unframed_link (name, listener) {
	var links = this.events[name];
	if (links === undefined) {
		this.events[name] = [listener];
	} else if (links.indexOf(listener) < 0) {
		links.push(listener);
	} else {
		throw (name + " identical listener added");
	}
}

function unframed_trace (name, message) {
	console.log(name + ' ' + JSON.stringify(message));
}

/**
 * Emit a named event with a message, apply all the listeners or log
 * an error on the console.
 */
function unframed_emit (name, message) {
	var links = this.events[name];
	if (links === undefined) {
		throw (name + ' ' + JSON.stringify(message));
	} else {
		this.trace(name, message);
		links.forEach(function (listener) {
			listener.apply(this, [message]);
		});
	}
}

/**
 * The application's state at minima: message listeners linked to named events.
 */
function Unframed (name) {
	this.name = name;
	this.events = {};
}

/**
 * The Unframed application base prototype.
 */
Unframed.prototype = {
	link: unframed_link,
	emit: unframed_emit,
	trace: unframed_trace
}

/**
 * Let an application emit DOM Ready and DOM Unload events, with muted confirmation.
 */
function unframed_dom(app) {
	if (document.addEventListener) {
		document.addEventListener('DOMContentLoaded', function unframed_dom_ready () {
			app.emit('DOM Ready');
		});
		window.addEventListener("beforeunload", function unframed_dom_unload () {
			app.emit('DOM Unload');
		});
	} else { // IE8
		document.attachEvent('onreadystatechange', function unframed_dom_ready () {
			if (document.readyState === 'interactive') {
				app.emit('DOM Ready');
			}
		});
		window.attachEvent('onbeforeunload', function unframed_dom_unload () {
			app.emit('DOM Unload');
		});
	}
	return app;
}

/**
 * The unframed factory, an Unframed application that emit DOM Ready and DOM Unload.
 */
function unframed (name) {
	return unframed_dom(new Unframed(name));
}

/**
 * Add or replace Unframed's methods.
 */
function unframed_extend(methods) {
	Object.keys(methods).forEach(function (key) {
		Unframed.prototype[key] = methods[key];
	});
}

unframed.extend = unframed_extend;
unframed.trace = function (traceOn) {
    if (traceOn) {
        Unframed.prototype.trace = unframed_trace;
    } else {
        Unframed.prototype.trace = function pass () {};
    }
}
window.unframed = unframed;
// attach to window, still the one true HTML5 application's frame.