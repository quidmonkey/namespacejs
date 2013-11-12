(function (global) {

    module = function module (namespace, closure) {
        var args = [],
            dependencies,
            key,
            leaf = global,
            name,
            required,
            root,
            tree = namespace.split('.');

        // create namespace
        while (tree.length) {
            name = tree.shift();

            // is capitalized to conform to best practice of naming modules?
            if (/[^A-Z]/.test(name[0])) {
                console.log(
                    '~~~~ namespacejs: Ruh roh. It is best practice to capitalize \'' +
                    name + '\' in namespace \'' + namespace + '\' to avoid naming collisions.'
                );
            }

            root = leaf;
            leaf = root[name] = root[name] || {};
        }
        
        // get dependencies
        dependencies = getDependencies(closure);
        while(dependencies.length) {
            required = getModule(dependencies.shift());
            if (!required) {
                return hasDependencies(namespace, closure);
            }
            args.push(required);
        }

        // create module
        closure.apply(leaf, args);
        cacheModule(name, namespace, leaf);

        // any unloaded modules?
        checkUnloaded();
    };

    modules = {};     // cached module set
    unloaded = [];    // modules with unloaded dependencies

    function cacheModule (name, namespace, module) {
        // already cached?
        if (modules[name]) {
            console.log(
                '~~~~ namespacejs: Ruh roh. Potential namespace collision on \'' +
                name + '\' for namespace \'' + namespace + '\''
            );
        } else {
            modules[name] = module;
        }
    }

    function checkUnloaded () {
        var toLoad,
            toUnload = unloaded;

        unloaded = [];

        while (toUnload.length) {
            toLoad = toUnload.shift();
            module(toLoad.namespace, toLoad.closure);
        }
    }

    function getDependencies (closure) {
        var dependencies = /\(([^)]*)/.exec(closure);

        if (!dependencies[1]) { return []; }

        return dependencies[1].split(/\s*,\s*/);
    }

    function getModule (name) {
        return modules[name];
    }

    function hasDependencies (namespace, closure) {
        unloaded.push({
            namespace: namespace,
            closure: closure
        });
    }

})(this);
