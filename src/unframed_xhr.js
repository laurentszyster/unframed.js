/* unframed_xhr.js */

/**
 * Handle a text response, `callback` with `xhr.status`.
 */
function unframed_xhr_handle_text (xhr, callback) {
	callback(xhr.status, xhr.responseText);
}

function unframed_xhr_fun (app, method, url, headers, body, handler, timeout, callback) {
/*

	Throw an exception if the method and url is busy, create this.xhrs guard if undefined.

*/
	var xhrKey = method+' '+url;
	if (app.xhrs === undefined) {
		app.xhrs = {};
	}
	if (app.xhrs[xhrKey] === true) {
		throw (["XHR resource is busy:", method, url].join(' '));
	}
	app.xhrs[xhrKey] = true;
/*

	Create and send an XHR request with the given `headers` and `body`, handle the response 
	with `handler(xhr, callback)`.

*/
	var xhr = new XMLHttpRequest();
//	Emit an HTTP response application event if `callback` is undefined.
	if (callback === undefined) {
		callback = function (status, response) {
			app.emit([status, method, url].join(' '), response);
		};
	}
//	Handle response as `callback(xhr.status, xhr.responseText) if `handler` is undefined.
	if (handler == undefined) {
		handler = unframed_xhr_handle_text;
	}
	xhr.onreadystatechange = function () {
		if (this.readyState === 4) {
			delete app.xhrs[xhrKey];
			handler(this, callback);
		}
	};
//	Open the request and set a timeout if one was requested and the API is available.
	xhr.open(method, url, true);
	if (timeout !== undefined && xhr.timeout == 0) {
		xhr.timeout = timeout;
		xhr.ontimeout = function() {
			delete app.xhrs[xhrKey];
			callback('TIMEOUT');
		};
	}
// 	Set the request headers, send its body.
	if (headers !== undefined) {
		Object.keys(headers).forEach(function (key) {
			xhr.setRequestHeader(key, headers[key]);
		});
	}
	xhr.send(body);
//	Free the request.
	xhr = null;
}

/**
 * If the requested resource is not busy, create, send, handle and free an XHR request.
 *
 * Throws an exception otherwise.
 */
function unframed_xhr_send (method, url, headers, body, handler, timeout, callback) {
	return unframed_xhr_fun(
		this, method, url, headers, body, 
		handler, timeout, callback
		);
}

function unframed_xhr_urlencode(form) {
	var b = [];
	Object.keys(form, function(key) {
		b.push([
			encodeURIComponent(key),
			encodeURIComponent(form[key].toString()).replace('%20','+')
			].join('='));
	});
	return b.join('&');
}

function unframed_xhr_urlquery(url, form) {
	return form === undefined ? url: [url, unframed_xhr_urlencode(form)].join('&');
}

/**
 * If the resource is not busy GET the `url` with `form` parameters and `headers`, 
 * call `callback(status, text)` on response or emit a `XXX GET url' event 
 * with the text as message.
 */
function unframed_xhr_get_text (url, form, headers, timeout, callback) {
	return unframed_xhr_fun(
		this, 'GET', unframed_xhr_urlquery(url, form), headers, null, 
		unframed_xhr_handle_text, timeout, callback
		);
}

/**
 * If the resource is not busy, POST the `form` parameters to the `url` 
 * then on response `callback(status, text)` or emit a `XXX POST url` event 
 * with the response's text as message.
 */
function unframed_xhr_post_form (url, form, timeout, callback) {
	return unframed_xhr_fun(
		this, 'POST', url, {
			'Content-Type': 'application/x-www-form-urlencoded',
		}, unframed_xhr_urlencode(form), 
		unframed_xhr_handle_json, timeout, callback
		);
}

/**
 * Try to parse the response's body in a JSON message, 
 * then callback with the response's status and message or
 * the JSON exception's error and the original response text.
 */
function unframed_xhr_handle_json (xhr, callback) {
	var message;
	try {
		message = JSON.parse(xhr.responseText); 
	} catch (e) {
		message = {
			'jsonError': e.toString(),
			'responseText': xhr.responseText
		};
	}
	callback(xhr.status, message);
}

/**
 * If the resource is not busy GET the `url` with `query` parameters,
 * try to parse a JSON response body and call `callback(code, json)`
 * or emit a `XXX GET url` event with the JSON object or parser error 
 * as message.
 */
function unframed_xhr_get_json (url, query, timeout, callback) {
	return unframed_xhr_fun(
		this, 'GET', unframed_xhr_urlquery(url, query), {
			'Accept': 'application/json, */*'
		}, null, 
		unframed_xhr_handle_json, timeout, callback
		);
}

/**
 * If the resource is not busy, encode and POST a `request` to the given `url`, 
 * try to parse a JSON response body and call `callback(code, json)` 
 * or emit a `XXX POST url` event with the JSON object or parser error 
 * as message.
 */
function unframed_xhr_post_json (url, request, timeout, callback) {
	return unframed_xhr_fun(
		this, 'POST', url, {
			'Accept': 'application/json, */*',
			'Content-Type': 'application/json; charset=UTF-8'
		}, JSON.stringify(request), 
		unframed_xhr_handle_json, timeout, callback
		);
}

window.unframed.extend({
	xhrSend: unframed_xhr_send,
	xhrGetJson: unframed_xhr_get_json,
	xhrPostJson: unframed_xhr_post_json,
	xhrGetText: unframed_xhr_get_text,
	xhrPostForm: unframed_xhr_post_form
});