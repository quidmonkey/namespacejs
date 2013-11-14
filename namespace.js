(function (global) {

    module = function module () {
        var args = [],
            dependency,
            dependencies,
            inject,
            key,
            leaf,
            name,
            namespace = arguments[0];

        if (arguments.length === 2) {
            closure = arguments[1];
            dependencies = [];
        } else if (arguments.length === 3) {
            closure = arguments[2];
            dependencies = arguments[1];
        } else {
            throw new Error('~~~~ namespacejs: Unknown number of parameters given to module function');
        }

        // create namespace
        // while (tree.length) {
        //     name = tree.shift();

        //     // is capitalized to conform to best practice of naming modules?
        //     if (/[^A-Z]/.test(name[0])) {
        //         console.log(
        //             '~~~~ namespacejs: Ruh roh. It is best practice to capitalize \'' +
        //             name + '\' in namespace \'' + namespace + '\' to avoid naming collisions.'
        //         );
        //     }

        //     root = leaf;
        //     leaf = root[name] = root[name] || {};
        // }

        leaf = getModule(namespace);
        
        while(dependencies.length) {
            dependency = getModule(dependencies.shift());
            if (isEmptyObject(dependency)) {
                return hasDependencies(namespace, dependencies, closure);
            }
            args.push(dependency);
        }

        // create module
        closure.apply(leaf, args);
        // registerModule(name, namespace, leaf);

        // any unloaded modules?
        checkUnloaded();

        // return our new module!
        return leaf;
    };

    registerModule = function registerModule (namespace, module) {
        getModule(namespace) = module;
    }

    unloaded = [];    // modules with unloaded dependencies

    function checkUnloaded () {
        var toUnload = unloaded;

        unloaded = [];

        while (toUnload.length) {
            module.apply(global, toUnload.shift());
        }
    }

    function getModule (namespace) {
        var leaf = global,
            tree = namespace.split(',');

        while (tree.length) {
            leaf = leaf[tree.shift()] || {};
        }

        return leaf;
    }

    function hasDependencies (namespace, dependencies, closure) {
        unloaded.push({
            namespace: namespace,
            dependencies: dependencies,
            closure: closure
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
