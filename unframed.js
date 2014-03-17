(function() {
    function unframed_link(name, listener) {
        var links = this.events[name];
        if (links === undefined) {
            this.events[name] = [ listener ];
        } else if (links.indexOf(listener) < 0) {
            links.push(listener);
        } else {
            throw name + " identical listener added";
        }
    }
    function unframed_trace(name, message) {
        console.log(name + " " + JSON.stringify(message));
    }
    function unframed_emit(name, message) {
        var links = this.events[name];
        if (links === undefined) {
            throw name + " " + JSON.stringify(message);
        } else {
            this.trace(name, message);
            links.forEach(function(listener) {
                listener.apply(this, [ message ]);
            });
        }
    }
    function Unframed(name) {
        this.name = name;
        this.events = {};
    }
    Unframed.prototype = {
        link: unframed_link,
        emit: unframed_emit,
        trace: unframed_trace
    };
    function unframed_dom(app) {
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", function unframed_dom_ready() {
                app.emit("DOM Ready");
            });
            window.addEventListener("beforeunload", function unframed_dom_unload() {
                app.emit("DOM Unload");
            });
        } else {
            document.attachEvent("onreadystatechange", function unframed_dom_ready() {
                if (document.readyState === "interactive") {
                    app.emit("DOM Ready");
                }
            });
            window.attachEvent("onbeforeunload", function unframed_dom_unload() {
                app.emit("DOM Unload");
            });
        }
        return app;
    }
    function unframed(name) {
        return unframed_dom(new Unframed(name));
    }
    function unframed_extend(methods) {
        Object.keys(methods).forEach(function(key) {
            Unframed.prototype[key] = methods[key];
        });
    }
    unframed.extend = unframed_extend;
    unframed.trace = function(traceOn) {
        if (traceOn) {
            Unframed.prototype.trace = unframed_trace;
        } else {
            Unframed.prototype.trace = function pass() {};
        }
    };
    window.unframed = unframed;
    function unframed_local_get(key) {
        return window.localStorage.getItem([ this.name, key ].join("/"));
    }
    function unframed_local_remove(key) {
        return window.localStorage.removeItem([ this.name, key ].join("/"));
    }
    function unframed_local_set(key, data) {
        return window.localStorage.setItem([ this.name, key ].join("/"), data);
    }
    function unframed_local_get_json(key) {
        return JSON.parse(window.localStorage.getItem([ this.name, key ].join("/")));
    }
    function unframed_local_set_json(key, value) {
        return window.localStorage.setItem([ this.name, key ].join("/"), JSON.stringify(value));
    }
    function unframed_local() {
        var app = this;
        path = app.name + "/", pathLeng = path.length;
        function unframed_storage(e) {
            if (e.key.indexOf(path) == 0) {
                app.emit("localStorage", {
                    key: e.key.substring(pathLen),
                    oldValue: e.oldValue,
                    newValue: e.newValue
                });
            }
        }
        if (window.addEventListener) {
            window.addEventListener("storage", unframed_storage, false);
        } else {
            window.attachEvent("onstorage", function onstorage() {
                unframed_storage(window.event);
            });
        }
        app.localStorage = function() {
            throw "localStorage called twice on " + this.name;
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
    function unframed_xhr_handle_text(xhr, callback) {
        callback(xhr.status, xhr.responseText);
    }
    function unframed_xhr_fun(app, method, url, headers, body, handler, timeout, callback) {
        var xhrKey = method + " " + url;
        if (app.xhrs === undefined) {
            app.xhrs = {};
        }
        if (app.xhrs[xhrKey] === true) {
            throw [ "XHR resource is busy:", method, url ].join(" ");
        }
        app.xhrs[xhrKey] = true;
        var xhr = new XMLHttpRequest();
        if (callback === undefined) {
            callback = function(status, response) {
                app.emit([ status, method, url ].join(" "), response);
            };
        }
        if (handler == undefined) {
            handler = unframed_xhr_handle_text;
        }
        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                delete app.xhrs[xhrKey];
                handler(this, callback);
            }
        };
        xhr.open(method, url, true);
        if (timeout !== undefined && xhr.timeout == 0) {
            xhr.timeout = timeout;
            xhr.ontimeout = function() {
                delete app.xhrs[xhrKey];
                callback("TIMEOUT");
            };
        }
        if (headers !== undefined) {
            Object.keys(headers).forEach(function(key) {
                xhr.setRequestHeader(key, headers[key]);
            });
        }
        xhr.send(body);
        xhr = null;
    }
    function unframed_xhr_send(method, url, headers, body, handler, timeout, callback) {
        return unframed_xhr_fun(this, method, url, headers, body, handler, timeout, callback);
    }
    function unframed_xhr_urlencode(form) {
        var b = [];
        Object.keys(form, function(key) {
            b.push([ encodeURIComponent(key), encodeURIComponent(form[key].toString()).replace("%20", "+") ].join("="));
        });
        return b.join("&");
    }
    function unframed_xhr_urlquery(url, form) {
        return form === undefined ? url : [ url, unframed_xhr_urlencode(form) ].join("&");
    }
    function unframed_xhr_get_text(url, form, headers, timeout, callback) {
        return unframed_xhr_fun(this, "GET", unframed_xhr_urlquery(url, form), headers, null, unframed_xhr_handle_text, timeout, callback);
    }
    function unframed_xhr_post_form(url, form, timeout, callback) {
        return unframed_xhr_fun(this, "POST", url, {
            "Content-Type": "application/x-www-form-urlencoded"
        }, unframed_xhr_urlencode(form), unframed_xhr_handle_json, timeout, callback);
    }
    function unframed_xhr_handle_json(xhr, callback) {
        var message;
        try {
            message = JSON.parse(xhr.responseText);
        } catch (e) {
            message = {
                jsonError: e.toString(),
                responseText: xhr.responseText
            };
        }
        callback(xhr.status, message);
    }
    function unframed_xhr_get_json(url, query, timeout, callback) {
        return unframed_xhr_fun(this, "GET", unframed_xhr_urlquery(url, query), {
            Accept: "application/json, */*"
        }, null, unframed_xhr_handle_json, timeout, callback);
    }
    function unframed_xhr_post_json(url, request, timeout, callback) {
        return unframed_xhr_fun(this, "POST", url, {
            Accept: "application/json, */*",
            "Content-Type": "application/json; charset=UTF-8"
        }, JSON.stringify(request), unframed_xhr_handle_json, timeout, callback);
    }
    window.unframed.extend({
        xhrSend: unframed_xhr_send,
        xhrGetJson: unframed_xhr_get_json,
        xhrPostJson: unframed_xhr_post_json,
        xhrGetText: unframed_xhr_get_text,
        xhrPostForm: unframed_xhr_post_form
    });
})();