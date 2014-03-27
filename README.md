unframed.js
===
A javascript application prototype.

Modern web applications have a wealth of API to apply covering a wide range of subsystems, from sending XHR requests to network services to getting user medias or playing music. How to not get entangled in some callback hell or an event race ?

Starting an application from an `Unframed` prototype forces upfront to think the application in terms of named events and state transitions. In return this allows to build an application from linked components exchanging messages at one convenient traceable state, the application's state.

The `Unframed` also includes conveniences for the basic functions of many HTML5 application: DOM ready and unload event, local storage of JSON objects; GET from and POST common MIME type to URLs. Those common conveniences eventually emit events that your application can handle.

Add application's events, handlers and emitter at your convenience while decoupling your application's components along the way.

Synopsis
---
Link or include the [unframed.js](https://github.com/laurentszyster/unframed.js/unframed.js) sources or a minified equivalent in an HTML document.

Call the `window.unframed` factory function to get a named instance of proptotype `Unframed`.

~~~javascript
var myapp = window.unframed('myapp');
~~~

The variable `myapp` is supposed to hold the state of your application. It will receive at least two events: `DOM Ready` and `DOM Unload`. 

Handle them at minima first.

~~~javascript
myapp.link('DOM Ready', function () {
    console.log('ready');
});
myapp.link('DOM Unload', function () {
    alert('unload'); // should be blocked
});
~~~

To send an 'hello' event message to `myapp` when the value of the `hello` element changes, do:

~~~javascript
document.getElementById('hello').addEventListener(
    'change', function (evt) {
        myapp.emit('hello', {
            'who': 'world'
        });
    }
);
~~~

Now the application's handling of the "hello" event is decoupled from its emitter. This application event can be received by more than one component, it may also be emitted by another component.

~~~javascript
myapp.link('hello', function (message) {
    document.getElementById('message').textContent = message['who'];
});
myapp.link('hello', function (message) {
    console.log(message['who']);
});
~~~

You can mute the application events trace, in production.

~~~javascript
myapp.trace(false);
~~~

Use Cases
---
A web socket connection may disconnect on user request, on network failure, on timeout, etc. Yet, disconnection of this socket should be reflected by the application's user interface components in the same way whatever the cause and regardless of how the application's storage components will react to disconnection.

A public and private version of an otherwise identical application, one with a weak RSA authorization scheme, another with a strong ECDH key exchange. Otherwise identical applications with different versions of the same component depending on their media device capabilities.

Practically, any HTML5 application should be broken down into events first. Components will emerge as distinct sets of application events sent and received.