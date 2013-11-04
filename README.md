NamespaceJS
===========

UMD, CommonJS, NodeJS and ES6 module systems all are exhaustive solutions to a simple problem. At its core, modulization is an object tree, constructed of leaves, each of which encapsulates a section of code.

NamespaceJS aims to be a simple solution: it is neither thorough nor opinionated. It lets third-party solutions do their thing, while you worry about managing your own code branch.

To define a module, all you must do is give it a namespace and your closed-over code:

```javascript
module('foo', function () {
    // code
});
```

This hangs an object named foo off of the global scope.

A namespace can have multiple sub-namespaces, each delimited by a '.':

```javascript
module('foo.bar', function () {
    // code
});
```

This hangs an object named foo off of the global scope, which has a sub-object named bar hanging off of foo.

You can namespace things as far down as you like, and NamespaceJS will create the intermediary leaf as it traverses the tree to the desired namespace.

If you accidentally give two modules the same namespace, NamespaceJS will kindly inform you of the conflict by logging a warning.
