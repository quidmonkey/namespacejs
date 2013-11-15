(function (global) {

    var unloaded = [],  // modules with unloaded dependencies
        modules = {};   // cached module set

    module = function module () {
        var args = [],
            dependency,
            dependencies,
            i = 0,
            leaf,
            namespace,
            params = arguments;

        // parse overridden function signature
        if (params.length === 2) {
            closure = params[1];
            dependencies = [];
            namespace = params[0];
        } else {
            closure = params[2];
            dependencies = params[1];
            namespace = params[0];
        }

        // create namespace
        leaf = registerModule(namespace);

        // get dependencies
        for (; i < dependencies.length; i++) {
            dependency = getModule(dependencies[i]);
            if (!dependency) {
                return hasDependencies(closure, dependencies, namespace);
            }
            args.push(dependency);
        }

        // create module
        closure.apply(leaf, args);
        cacheModule(namespace, leaf);

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

                // whenever a new module is added
                // check to see if another module
                // lists it as a dependency
                checkUnloaded();
            }

            return module;
        }

        // no module, so return a reference to the namespace!
        return leaf;
    };

    function cacheModule (namespace, module) {
        modules[namespace] = module;
    }

    function checkUnloaded () {
        var current,
            toLoad = unloaded;

        unloaded = [];

        while (toLoad.length) {
            current = toLoad.shift();
            module.call(global, current.namespace, current.dependencies, current.closure);
        }
    }

    function getModule (namespace) {
        return modules[namespace];
    }

    function hasDependencies (closure, dependencies, namespace) {
        unloaded.push({
            closure: closure,
            dependencies: dependencies,
            namespace: namespace
        });
    }

})(this);
