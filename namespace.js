(function (global) {

    var unloaded = [];  // modules with unloaded dependencies

    module = function module () {
        var args = [],
            dependency,
            dependencies,
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
        leaf = getModule(namespace, true);

        // get dependencies
        while(dependencies.length) {
            dependency = getModule(dependencies.shift());
            if (isEmptyObject(dependency)) {
                return hasDependencies(closure, dependencies, namespace);
            }
            args.push(dependency);
        }

        // create module
        closure.apply(leaf, args);

        // any unloaded modules?
        checkUnloaded();

        // return our new module!
        return leaf;
    };

    registerModule = function registerModule (namespace, module) {
        var leaf = global,
            name,
            tree = namespace.split(',');

        while (tree.length > 1) {
            name = tree.shift();
            leaf = root[name] || {};
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

    function checkUnloaded () {
        var toUnload = unloaded;

        unloaded = [];

        while (toUnload.length) {
            module.call(global, toUnload.shift());
        }
    }

    function getModule (namespace, warn) {
        var leaf = global,
            name,
            tree = namespace.split(',');

        while (tree.length) {
            name = tree.shift();
            leaf = leaf[name] || {};
        }

        // is capitalized to conform to best practice of naming modules?
        if (warn) {
            // namespace not following best practice?
            if (/[^A-Z]/.test(name[0])) {
                console.log(
                    '~~~~ namespacejs: Ruh roh. It is best practice to capitalize \'' +
                    name + '\' in namespace \'' + namespace + '\' to avoid naming collisions.'
                );
            }
            // namespace in use?
            if (!isEmptyObject(leaf)) {
                console.log(
                    '~~~~ namespacejs: Ruh roh. Potential namespace collision on \'' +
                    name + '\' in namespace \'' + namespace + '\''
                );
            }
        }

        return leaf;
    }

    function hasDependencies (closure, dependencies, namespace) {
        unloaded.push({
            closure: closure,
            dependencies: dependencies,
            namespace: namespace
        });
    }

    function isEmptyObject (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

})(this);
