(function (global) {

    var unloaded = [],  // modules with unloaded dependencies
        modules = {};   // cached module set

    module = function module () {
        var args = [],
            dependency,
            dependencies,
            i = 0,
            leaf,
            namespace;

        // parse overridden function signature
        if (arguments.length === 2) {
            closure = arguments[1];
            dependencies = [];
            namespace = arguments[0];
        } else if (arguments.length === 3) {
            closure = arguments[2];
            dependencies = arguments[1];
            namespace = arguments[0];
        } else {
            closure = arguments[0].closure;
            dependencies = arguments[0].dependencies;
            namespace = arguments[0].namespace;
        }

        // create namespace
        leaf = createNamespace(namespace);

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
            tree = namespace.split('.');

        while (tree.length > 1) {
            name = tree.shift();
            leaf = leaf[name] = leaf[name] || {};
        }

        name = tree.shift();

        // namespace already registered?
        if (leaf[name]) {
            console.log(
                '~~~~ namespacejs: Ruh roh. Namespace collision on \'' +
                name + '\' in namespace \'' + namespace + '\'. Not registering module.'
            );
            return;
        }

        leaf[name] = module;
    };

    function cacheModule (namespace, module) {
        modules[namespace] = module;
    }

    function checkUnloaded () {
        var toUnload = unloaded;

        unloaded = [];

        while (toUnload.length) {
            module.call(global, toUnload.shift());
        }
    }

    function createNamespace (namespace) {
        var leaf = global,
            name,
            tree = namespace.split('.');

        while (tree.length) {
            name = tree.shift();
            leaf = leaf[name] = leaf[name] || {};
        }

        // namespace not following best practice?
        if (/[^A-Z]/.test(name[0])) {
            console.log(
                '~~~~ namespacejs: Ruh roh. It is best practice to capitalize \'' +
                name + '\' in namespace \'' + namespace + '\' to avoid naming collisions.'
            );
        }

        return leaf;
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
