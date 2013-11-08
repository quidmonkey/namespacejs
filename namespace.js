module = function (namespace, module) {
    var args = [],
        global = global || window,
        key,
        leaf = global,
        name,
        params,
        required,
        root,
        tree;

    tree = namespace.split('.');

    while (tree.length) {
        name = tree.shift();

        // is capitalized to conform to best practice of naming modules?
        if (/[^A-Z]/.test(name[0])) {
            console.log('~~~~ namespacejs: Ruh roh. It\'s considered best practice to capitalize your namespace for \'' + name +
                        '\' in namespace \'' + namespace + '\' to avoid naming collisions.');
        }

        root = leaf;
        leaf = root[name] = root[name] || {};
    }

    // empty object?
    // for (key in leaf) {
    //     if (leaf.hasOwnProperty(key)) {
    //         console.log('~~~~ namespacejs: Ruh roh. Potential namespace collision on \'' + namespace +'\'');
    //         break;
    //     }
    // }

    if (module.dependencies[leaf]) {
        throw '~~~~ namespacejs: Namespace collision on \'' + name +'\' for namespace \'' + namespace + '\'';
    }

    module.dependencies[leaf] = namespace;
    
    params = getParams(module);

    while(params.length) {
        required = getModule(params.shift());
        if (required === null) {
            return hasDependencies(namespace, module);
        }
        args.push(required);
    }

    // module.call(leaf, global, root);
    module.apply(leaf, args);
};

checkCache = function () {
    var cache = module.cache,
        toLoad;

    module.cache = [];

    while (cache.length) {
        toLoad = cache.shift();
        module(toLoad.namespace, toLoad.module);
    }
};

getModule = function (leaf) {
    return module.dependencies[leaf];
};

getParams = function (module) {
    var i,
        params = /\(([^)]+)/.exec(module);

    if (!params[1]) { return []; }

    params = params[1].split(/\s*,\s*/);
    
    for (i = params.length; i--;) {
        if (!/\$/.test(params[i])) {
            params.splice(i, 1);
        }
    }

    return params;
};

hasDependencies = function (namespace, module) {
    module.cache.push({
        namespace: namespace,
        module: module
    });
};

module.cache = [];
module.dependencies = {};
