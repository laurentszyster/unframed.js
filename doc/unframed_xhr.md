Unframed XHR
===
Extends the `Unframed` prototype with five methods.

One to send any XHR request to a url that is not yet busy for this application, eventually set a tieout and a callback or emit an application event on response.

~~~
xhrSend(method, url, headers, body, timeout, callback)
~~~

And four conveniences for the most common form of HTTP request:

~~~
xhrGetText(url, query, headers, timeout, callback)
xhrPostForm(url, form, timeout, callback)
xhrGetJson(url, query, timeout, callback)
xhrPostJson(url, request, timeout, callback)
~~~

These methods provide an API to send GET and POST requests to all type of web resources, with a minimum of conveniences for JSON, HTML and XML.

And by failing if the `url` requested is already busy, these methods force their applications to avoid concurrent requests to the same network resource.

Synopsis
---
If the URL requested is not busy for `myapp`, send a GET request for a JSON resource.

~~~javascript
myapp.xhrGetJson('hello.php');
~~~

Or send a query along, as a map of arguments.

~~~javascript
myapp.xhrGetJson('hello.php', {'n': 'World'});
~~~

Since `callback(status, message)` was left undefined an application event will be emitted on response.

For instance, on success.

~~~
200 GET hello.php {"who": "World"}
~~~

To POST a JSON body instead, do.

~~~javascript
myapp.xhrPostJson('greetings.php', {'who': 'World'});
~~~

Note that `xhrSend`, `xhrGetText`, `xhrPostForm`, `xhrGetJSON` and `xhrPostJson` methods maintain a table of busy URLs and prevent concurrent requests to the same resource.