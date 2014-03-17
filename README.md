unframed.js
===
A javascript application prototype.

The `Unframed` prototype is designed to program a web application as a flat list of named events listeners handling messages. It includes conveniences for the basic functions of many HTML5 application: DOM ready and unload event, local storage of JSON objects; GET from and POST common MIME type to URLs.

All those conveniences eventually emit events that your application can handle. Add application's events, handlers and emitter at *your* convenience, decoupling *your* application's components along the way as *you* program it.

Synopsis
---
Link or include [`unframed.js`](https://github.com/laurentszyster/unframed.js/unframed.js) or a minified equivalent in an HTML document.

Call the `window.unframed` factory function to get a named instance of proptotype `Unframed`.
```javascript
var myapp = window.unframed('myapp');
```

The variable `myapp` is supposed to hold the state of your application. It will receive at least two events: `DOM Ready` and `DOM Unload`. 

Handle them at minima first.
```javascript
myapp.link('DOM Ready', function () {
    console.log('ready');
});
myapp.link('DOM Unload', function () {
    alert('unload'); // should be blocked
});
```

To send an 'hello' event message to `myapp` when the value of the `hello` element changes, do:
```javascript
document.getElementById('hello').addEventListener(
    'change', function (evt) {
        myapp.emit('hello', {
            'who': 'world'
        });
    }
);
```

Now the application's handling of the "hello" event is decoupled from its emitter. This application event can be received by more than one component, it may also be emitted by another component.
```javascript
myapp.link('hello', function (message) {
    document.getElementById('message').textContent = message['who'];
});
myapp.link('hello', function (message) {
    console.log(message['who']);
});
```

Use Cases
---
A web socket connection may disconnect on user request, on network failure, on timeout, etc.

Yet, disconnection of this socket should be reflected by the application's user interface components in the same way whatever the cause and regardless of how the application's storage components will react to disconnection.

What matter is the `WS Disconnect` event upon which some DOM elements get disabled while some network components change some state from 'on' to 'off'.