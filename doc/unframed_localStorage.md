Unframed Local Storage
===
Extends the `Unframed` prototype with methods to: emit `localStorage` application events; load and remove keys prefixed with the application's name; save data in the same way; and do it with convenience for JSON objects.

~~~
localStorage()
localLoad(key)
localRemove(key)
localSave(key, data)
loadJson(key)
saveJson(key, object)
~~~

Synopsis
---
Save and load JSON values by keys, under the application's name path in its domain's local storage.

~~~javascript
var myapp = window.unframed('test');
myapp.saveJson('key', {"test": "case"})
myapp.loadJson('key');
~~~

To emit application events, first do :

~~~javascript
myapp.localStorage();
~~~

Now state transitions in the local storage will result in a stream of application events.

~~~javascript
myapp.saveJson('key', {"test": "update"});
myapp.saveJson('one', {"test": "create"});
myapp.localRemove('one');
myapp.loadJson('one');
~~~

...
