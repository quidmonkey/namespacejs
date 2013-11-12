(function (global) {

    var unloading = false;

    global.module = function module (namespace, closure) {
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
        if (!unloading) {
            checkUnloaded();
        }
    };

    global.modules = {};     // cached module set
    global.unloaded = [];    // modules with unloaded dependencies

    function cacheModule (name, namespace, module) {
        // already cached?
        if (global.modules[name]) {
            console.log(
                '~~~~ namespacejs: Ruh roh. Potential namespace collision on \'' +
                name + '\' for namespace \'' + namespace + '\''
            );
        } else {
            global.modules[name] = module;
        }
    }

    function checkUnloaded () {
        var toLoad,
            unloaded = global.unloaded;

        global.unloaded = [];

        unloading = true;
        while (unloaded.length) {
            toLoad = unloaded.shift();
            global.module(toLoad.namespace, toLoad.closure);
        }
        unloading = false;
    }

    function getDependencies (closure) {
        var dependencies = /\(([^)]*)/.exec(closure);

        if (!dependencies[1]) { return []; }

        return dependencies[1].split(/\s*,\s*/);
    }

    function getModule (name) {
        return global.modules[name];
    }

    function hasDependencies (namespace, closure) {
        global.unloaded.push({
            namespace: namespace,
            closure: closure
        });
    }

})(this);
