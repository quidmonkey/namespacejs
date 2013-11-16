(function (global) {
    var unloaded = [],  // modules with unloaded dependencies
        modules = {};   // cached module set


    getModule = function getModule (namespace) {
        return modules[namespace];
    };

    module = function module () {
        var args = arguments,
            dependencies,
            i = 0,
            leaf,
            namespace,
            params = [],
            toInject;

        // parse overridden function signature
        if (args.length === 2) {
            closure = args[1];
            dependencies = [];
            namespace = args[0];
        } else {
            closure = args[2];
            dependencies = args[1];
            namespace = args[0];
        }

        // create namespace
        leaf = registerModule(namespace);

        // get dependencies
        for (; i < dependencies.length; i++) {
            toInject = getModule(dependencies[i]);

            // is dependency unloaded?
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

        // create module
        closure.apply(leaf, params);
        cacheModule(namespace, leaf, dependencies);

        checkUnloaded();

        // return our new module!
        return leaf;
    };

    registerModule = function registerModule (namespace, module) {
        var leaf = global,
            name,
            root = global,
            tree = namespace.split('.');

        while (tree.length) {
            name = tree.shift();
            root = leaf;
            leaf = root[name] = root[name] || {};
        }

        // namespace not following best practice?
        if (/[^A-Z]/.test(name[0])) {
            console.log(
                '~~~~ namespacejs: Ruh roh. It is best practice to capitalize \'' +
                name + '\' in namespace \'' + namespace + '\' to avoid naming collisions.'
            );
        }

        // do we already have a module to register?
        if (module) {
            // namespace already registered?
            if (root[name]) {
                console.log(
                    '~~~~ namespacejs: Ruh roh. Namespace collision on \'' +
                    name + '\' in namespace \'' + namespace + '\'. Not registering module.'
                );
            } else {
                root[name] = module;
                removeGlobal(module);
                cacheModule(namespace, module);
                checkUnloaded();
            }

            return module;
        }

        // no module, so return a reference to the namespace!
        return leaf;
    };

    function cacheModule (namespace, module, dependencies) {
        modules[namespace] = {
            dependencies: dependencies || [],
            module: module
        };
    }

    // whenever a new module is added
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

    function hasUnloadedDependencies (closure, dependencies, namespace) {
        unloaded.push({
            closure: closure,
            dependencies: dependencies,
            namespace: namespace
        });
    }

    function isCircularDependency (namespace, dependency) {
        var i = 0,
            len = unloaded.length;

        // does an unloaded module have the namespace
        // listed as a dependency?
        for (; i < len; i++) {
            if (unloaded[i].namespace === dependency) {
                return unloaded[i].dependencies.indexOf(namespace) !== -1;
            }
        }

        return false;
    }

    function removeGlobal (obj) {
        for (var key in global) {
            if (global.hasOwnProperty(key)) {
                if (global[key] === obj) {
                    delete global[key];
                }
            }
        }
    }

})(this);
