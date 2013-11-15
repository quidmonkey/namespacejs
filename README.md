NamespaceJS
===========

UMD, CommonJS, NodeJS and ES6 module systems all are exhaustive solutions to a simple problem. At its core, modulization is an object tree, constructed of leaves, each of which encapsulates a section of code.

NamespaceJS aims to be a simple solution: it is neither thorough nor opinionated. It lets third-party solutions do their thing, while you worry about managing your own code branch.

To define a module, all you must do is give it a namespace and your closed-over code:

```javascript
module('Foo', function () {
    // code
});
```

This hangs an object named Foo off of the global scope.

A namespace can have multiple sub-namespaces, each delimited by a '.':

```javascript
module('Foo.Bar', function () {
    // code
});
```

This hangs an object named Foo off of the global scope, which has a sub-object named Bar hanging off of Foo.

You can namespace things as far down as you like, and NamespaceJS will create the intermediary leaf as it traverses the tree to the desired namespace:

```javascript
module('I.Am.An.Arbitrary.Namespace', function () {
    // code 
});
```

This creates a namespace branch 5 layers deep, and all 4 intermediary namespaces (I, Am, An and Arbitrary) will be created as empty objects.

If you accidentally give two modules the same namespace, NamespaceJS will kindly inform you of the conflict by logging a warning. In addition, if a namespace is not capitalized, NamespaceJS will kindly inform you so that you can conform to the best practice of capitalizing your modules, and thereby, avoid naming collisions.

### Dependency Injection

A module system is not complete without a dependency injection system. NamespaceJS features a simple dependency injection solution that loads module as specified dependencies become available:

```javascript
module('Foo.Bar', ['Foo'], function (Foo) {
    // code
});
```

This is the same Bar example as noted above, save that Foo is now being injected into Bar. When loading scripts, if Bar is encountered first, its load will be deferred until Foo is first loaded.

You can inject as many dependencies as you like:

```javascript
module('Foo.Bar.Baz', ['Foo', 'Foo.Bar'], function (Foo) {
    // code
});
```

Here, both Foo and Bar will be injected into Baz.

### Third Party Modules

Third party libraries can be registered like so:

```javascript
registerModule('$', $);
```

These libraries can then be injected like any other module:

```javascript
module('Foo', ['$'], function ($) {
    // code
});
```

### API

* module(string, function) - String specifies a namespace, function a closure.
* module(string, array, function) - String specifies a namespace, array a list of strings which are dependencies to be injected, function a closure.
* registerModule(string, object) - String specifies a namespace, object a module (or library) to store on the namespace.

A sample demonstration is included in this repository. You can run it by opening index.html in a web browser and reviewing the console.

NamespaceJS is a mere 438 bytes minified.
