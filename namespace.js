/* ========================================================================
 * NamespaceJS v1.1.0
 * A Lightweight JavaScript Client-Side Module System
 *
 * Copyright (c) 2013 Abraham Walters (ninjaspankypants.com)
 * https://github.com/quidmonkey/namespacejs
 *
 * Author: Abraham Walters
 * Website: http://ninjaspankypants.com/
 *
 * Released under the MIT license
 * https://github.com/quidmonkey/namespacejs/blob/master/LICENSE
 * ------------------------------------------------------------------------ */

(function (global) {'use strict';

  /*****************************
   * private
   *****************************/

  var unloaded = [],    // modules with unloaded dependencies
      modules = {};     // cached module set

  // Save module to the stack
  function cacheModule (namespace, module, dependencies) {
    modules[namespace] = {
      dependencies: dependencies || [],
      module: module
    };
  }

  // Whenever a new module is added,
  // check to see if another module
  // which lists it as a dependency
  // can now be loaded
  function checkUnloaded () {
    var current,
        toLoad = unloaded;

    unloaded = [];

    while (toLoad.length) {
      current = toLoad.shift();
      module.call(global, current.namespace, current.dependencies, current.closure);
    }
  }

  // This module can't be loaded due to
  // it having unloaded dependencies. So
  // save a copy of it for now to be loaded
  // at a later time.
  function hasUnloadedDependencies (closure, dependencies, namespace) {
    unloaded.push({
      closure: closure,
      dependencies: dependencies,
      namespace: namespace
    });
  }

  // Does this module require a module which also
  // requires it?
  function isCircularDependency (namespace, dependency) {
    var i,
      len = unloaded.length;

    for (i = 0; i < len; i++) {
      if (unloaded[i].namespace === dependency) {
        return unloaded[i].dependencies.indexOf(namespace) !== -1;
      }
    }

    return false;
  }

  // Create a given module!
  function registerModule (namespace, module) {
    var leaf = global,
        name,
        root = global,
        tree = namespace.split('.');

    if (module) {
      if (getModule(namespace)) {
        console.log(
          '~~~~ namespacejs: Ruh roh. Namespace collision on \'' + namespace +
          '\'. Not registering module.'
        );
        return;
      }
    }

    while (tree.length) {
      name = tree.shift();
      root = leaf;
      leaf = root[name] = root[name] || {};
    }

    // Is this namespace not following best practice?
    if (/[^A-Z|^$|^_]/.test(name[0])) {
      console.log(
        '~~~~ namespacejs: Ruh roh. It is best practice to capitalize \'' +
        name + '\' in namespace \'' + namespace + '\' to avoid naming collisions.'
      );
    }

    // Do we already have a module to register?
    if (module) {
      root[name] = module;
      return module;
    }

    // No module is defined, so return a reference to the namespace!
    return leaf;
  }

  // Attempt to remove a given module
  // from the global scope.
  function removeGlobal (obj) {
    var key;

    for (key in global) {
      if (global.hasOwnProperty(key)) {
        if (global[key] === obj) {
          delete global[key];
        }
      }
    }
  }

  /*****************************
   * public
   *****************************/

  // Log out and return the list of unloaded modules.
  // This is useful for debugging why a module did not load.
  global.debugNamespaces = function debugNamespace () {
    console.log('~~~~ namespacejs: Debug Mode - Unloaded Modules');

    var i;

    for (i = 0; i < unloaded.length; i++) {
      console.log(
        (i + 1) + ') Namespace: ' + unloaded[i].namespace +
        ' with Dependencies: ' + unloaded[i].dependencies.toString()
      );
    }

    return unloaded;
  };

  // Get a module from the cache given its namespace.
  global.getModule = function getModule (namespace) {
    return modules[namespace];
  };

  // Core method which defines a module and a namespace.
  global.module = function module () {
    var args = arguments,
        closure,
        dependencies,
        i,
        leaf,
        namespace,
        params = [],
        toInject;

    // Parse overridden function signature.
    if (args.length === 2) {
      closure = args[1];
      dependencies = [];
      namespace = args[0];
    } else {
      closure = args[2];
      dependencies = args[1];
      namespace = args[0];
    }

    for (i = 0; i < dependencies.length; i++) {
      toInject = getModule(dependencies[i]);

      // Is this dependency not loaded?
      if (!toInject) {
        if (isCircularDependency(namespace, dependencies[i])) {
          throw new Error('~~~~ namespacejs: Ruh roh. Unable to load \'' + namespace +
            '\' because it has a circular dependency on \'' + dependencies[i] + '\''
          );
        }
        return hasUnloadedDependencies(closure, dependencies, namespace);
      }

      params.push(toInject.module);
    }

    // Create module
    leaf = closure.apply(global, params);

    // Create namespace
    registerModule(namespace, leaf);

    cacheModule(namespace, leaf, dependencies);

    // See if any other modules can now be loaded
    // now that this module has been loaded.
    checkUnloaded();

    // Return our new module!
    return leaf;
  };

  global.registerLibrary = function registerLibrary (namespace, module) {
    // Is the target namespace not the global scope?
    if (/\./.test(namespace)) {
      removeGlobal(module);
    }
    return registerModule(namespace, module);
  };

})(this);
