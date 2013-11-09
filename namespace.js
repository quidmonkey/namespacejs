(function (global) {

    global.module = function module (namespace, module) {
        var args = [global],
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
                    '~~~~ namespacejs: Ruh roh. It\'s considered best practice to capitalize your namespace for \'' +
                    name + '\' in namespace \'' + namespace + '\' to avoid naming collisions.'
                );
            }

            root = leaf;
            leaf = root[name] = root[name] || {};
        }
        
        // get dependencies
        dependencies = getDependencies(module);
        while(dependencies.length) {
            required = getModule(dependencies.shift());
            if (required == null) {
                return hasDependencies(namespace, module);
            }
            args.push(required);
        }

        // create module
        module.apply(leaf, args);
        cacheModule(name, namespace, leaf);

        // any unloaded modules?
        checkUnloaded();
    };

    global.module.modules = {};     // cached module set
    global.module.unloaded = [];    // modules with dependencies that can't be loaded yet

    function cacheModule (name, namespace, module) {
        // already cached?
        if (global.module.modules[name]) {
            console.log(
                '~~~~ namespacejs: Ruh roh. Potential namespace collision on \'' +
                name + '\' for namespace \'' + namespace + '\''
            );
        } else {
            global.module.modules[name] = module;
        }
    };

    function checkUnloaded () {
        var toLoad,
            unloaded = global.module.unloaded;

        global.module.unloaded = [];

        while (unloaded.length) {
            toLoad = unloaded.shift();
            global.module(toLoad.namespace, toLoad.module);
        }
    };

    function getModule (leaf) {
        return global.module.modules[leaf];
    };

    function getDependencies (module) {
        var i,
            params = /\(([^)]+)/.exec(module);

        if (!params[1]) { return []; }

        params = params[1].split(/\s*,\s*/);
        
        // get rid of the global param
        params.shift();

        return params;
    };

    function hasDependencies (namespace, module) {
        global.module.unloaded.push({
            namespace: namespace,
            module: module
        });
    };

})(this);
