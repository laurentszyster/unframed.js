/* unframed_localStorage.js */

/**
 * Get the local storage's value of the given key prefixed for this application. 
 */
function unframed_local_get(key) {
	return window.localStorage.getItem([this.name, key].join('/'));
}

/**
 * Remove the local storage's value and the given key prefixed for this application. 
 */
function unframed_local_remove(key) {
	return window.localStorage.removeItem([this.name, key].join('/'));
}

/**
 * Set the local storage's value of the given key prefixed for this application. 
 */
function unframed_local_set(key, data) {
	return window.localStorage.setItem([this.name, key].join('/'), data);
}

/**
 * Load JSON from the local storage
 */
function unframed_local_get_json(key) {
	return JSON.parse(window.localStorage.getItem([this.name, key].join('/')));
}

/**
 * Save JSON to the local storage.
 */
function unframed_local_set_json(key, value) {
	return window.localStorage.setItem([this.name, key].join('/'), JSON.stringify(value));
}
/**
 * Delegate localStorage events fot its keys to this application, unprefix keys.
 */
function unframed_local () {
	var app = this;
		path = app.name + '/',
		pathLeng = path.length;
	function unframed_storage (e) {
		if (e.key.indexOf(path) == 0) {
			app.emit('localStorage', {
				'key': e.key.substring(pathLen), 
				'oldValue': e.oldValue, 
				'newValue': e.newValue
			});
		}
	}
	if (window.addEventListener) {
		window.addEventListener("storage", unframed_storage, false);
	} else { // IE8
		window.attachEvent("onstorage", function onstorage () {
			unframed_storage(window.event); 
		});
	}
	app.localStorage = function () {
		throw ("localStorage called twice on " + this.name);
	};
}
window.unframed.extend({
	localLoad: unframed_local_get,
	localSave: unframed_local_set,
	localRemove: unframed_local_remove,
	saveJson: unframed_local_set_json,
	loadJson: unframed_local_get_json,
	localStorage: unframed_local
});