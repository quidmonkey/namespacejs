NamespaceJS
===========

![Build Status](https://travis-ci.org/quidmonkey/namespace.svg?branch=master]

UMD, CommonJS, NodeJS and ES6 module systems all are exhaustive solutions to a simple problem. At its core, modulization can be thought of as an object tree, constructed of leaves, each of which encapsulates a section of code.

NamespaceJS aims to be a simple solution: it is neither thorough nor opinionated. It lets third-party solutions do their thing, while you worry about managing your own code branch.

NamespaceJS is not a script loader, but a client-side module system. It does not require a compilation step, a polyfill, or any sort of shim to work; and it uglifies without issue.

## Defining a Namespace

To define a namespace, all you must do is give it a name and your closed-over code:

```javascript
namespace('Foo', function () {
    // code
});
```

This hangs an object named Foo off of the global scope.

A namespace can have multiple sub-namespaces, each delimited by a '.':

```javascript
namespace('Foo.Bar', function () {
    // code
});
```

This hangs an object named Foo off of the global scope, which has a sub-object named Bar hanging off of Foo.

You can namespace things as far down as you like, and NamespaceJS will create the intermediary leaf as it traverses the tree to the desired namespace:

```javascript
namespace('I.Am.An.Arbitrary.Namespace', function () {
    // code 
});
```

This creates a namespace branch 5 layers deep, and all 4 intermediary namespaces (I, Am, An and Arbitrary) will be created as empty objects.

If you accidentally give two namespaces the same name, NamespaceJS will kindly inform you of the conflict by logging a warning. In addition, if a namespace is not capitalized, NamespaceJS will kindly inform you so that you can conform to the best practice of capitalizing your modules, and thereby, avoid naming collisions.

## Factory Pattern

NamespaceJS enforces a factory pattern, expecting any namespace to return an object, function or array. This is due to the object tree requiring nodes to be interconnected. Returning a boolean, string or number will result in an error.

For convenience, the namespace method returns any value returned by the closed over code:

```javascript
var FooClass = namespace('Foo', function () {
    // initialize & private code
    return function (options) {
        // constructor code
    };
});

var fooInstance = new FooClass();
```

Several mocked examples are included in the mocks.js file. You are also encouraged to dig into the spec.js file and review the unit tests, as many examples and use cases are included therein.

## Dependency Injection

A module system is not complete without a dependency injection system. NamespaceJS features a simple dependency injection solution that loads module as specified dependencies become available:

```javascript
namespace('Foo.Bar', ['Foo'], function (Foo) {
    // code
});
```

This is the same Bar example as noted above, save that Foo is now being injected into Bar. When loading scripts, if Bar is encountered first, its load will be deferred until Foo is loaded. This will free up the need to manually monitor your script loading:

```html
<!-- NamespaceJS will load Bar after Foo, due to Bar having a dependency on Foo -->
<!-- No need to worry about which order you list your scripts -->
<script type="text/javascript" src="example/scripts/bar.js"></script>
<script type="text/javascript" src="example/scripts/foo.js"></script>
```

You can inject as many dependencies as you like:

```javascript
namespace('Foo.Bar.Baz', ['Foo', 'Foo.Bar'], function (Foo, Bar) {
    // code
});
```

Here, both Foo and Bar will be injected into Baz.

## Circular Dependencies

It is important to avoid circular dependencies:

```javascript
namespace('Namespace.One', ['Namespace.Two'], function (namespaceTwo) {});
namespace('Namespace.Two', ['Namespace.One'], function (namespaceOne) {});
```

Here Namespace.One is requiring Namespace.Two and vice versa, each preventing the other from loading. NamespaceJS will catch this condition for you and throw an error.

## Third Party Modules

Third party libraries can be registered like so:

```javascript
registerLibrary('$', $);
```

These libraries can then be injected like any other namespace:

```javascript
namespace('Foo', ['$'], function ($) {
    // code
});
```

If a third party module is namespaced somewhere other than the global scope, it will be removed from the global scope and placed into the specified namespace.

## API

* `debugNamespaces()` - Prints out a list of any unloaded dependencies. Useful for debugging.
* `getNamespace(string)` - String specifies a namespace. Gets the module at the given namespace.
* `namespace(string, function)` - String specifies a namespace, function a closure. Creates a module on the given namespace using the closed over code block. Returns any return value from the closed over code block.
* `namespace(string, array, function)` - String specifies a namespace, array a list of strings which are dependencies to be injected, function a closure. Creates a module on the given namespace using the closed over code block and injecting the given dependencies into the closure.
* `registerLibrary(string, object)` - String specifies a namespace, object a module (or library) to store on the namespace. Registers an object on the given namespace. This will attempt to remove the library from the global scope. Useful for namespacing third party libraries.

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/20e24f332601aac16a37554432cdad67 "githalytics.com")](http://githalytics.com/quidmonkey/namespacejs)

