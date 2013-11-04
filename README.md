NamespaceJS
===========

UMD, CommonJS, NodeJS and ES6 module systems all are exhaustive solutions to a simple problem. At its core, modulization is an object tree, constructed of leaves, each of which encapsulates a section of code.

NamespaceJS aims to be a simple solution: it is neither thorough nor opinionated. It lets third-party solutions do their thing, while you worry about managing your own code branch.

To define a module, all you must do is give it a namespace and your closed-over code:

```javascript
module('Foo', function (global, parent) {
    // code
});
```

This hangs an object named Foo off of the global scope. Both the global scope and the parent namespace will be passed into a module. In this case, both global and parent reference the same thing: the global scope.

A namespace can have multiple sub-namespaces, each delimited by a '.':

```javascript
module('Foo.Bar', function (global, parent) {
    // code
});
```

This hangs an object named foo off of the global scope, which has a sub-object named Bar hanging off of Foo. Both the global scope and the parent namesapce are once again passed in. In this case, global references the global scope, while parent references Foo.

You can namespace things as far down as you like, and NamespaceJS will create the intermediary leaf as it traverses the tree to the desired namespace:

```javascript
module('I.Am.An.Arbitrary.Namespace', function (global, parent) {
    // code 
});
```

This creates a namespace branch 5 layers deep, and all 4 intermediary namespaces (I, Am, An and Arbitrary) will be created as empty objects.

If you accidentally give two modules the same namespace, NamespaceJS will kindly inform you of the conflict by logging a warning.
