module = function (namespace, module) {
    var args = [],
        dependencies,
        global = global || window,
        key,
        leaf = global,
        name,
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

    cacheModule(name, namespace);
    
    dependencies = getDependencies(module);

    while(dependencies.length) {
        required = getModule(dependencies.shift());
        if (required === null) {
            return hasDependencies(namespace, module);
        }
        args.push(required);
    }

    // module.call(leaf, global, root);
    module.apply(leaf, args);

    checkUnloaded();
};

cacheModule = function (name, namespace) {
    if (module.modules[name]) {
        throw '~~~~ namespacejs: Namespace collision on \'' + name +'\' for namespace \'' + namespace + '\'';
    }

    module.modules[name] = namespace;
};

checkUnloaded = function () {
    var toLoad,
        unloaded = module.unloaded;

    module.unloaded = [];

    while (unloaded.length) {
        toLoad = unloaded.shift();
        module(toLoad.namespace, toLoad.module);
    }
};

getModule = function (leaf) {
    return module.modules[leaf];
};

// getDependencies = function (module) {
//     var i,
//         params = /\(([^)]+)/.exec(module);

//     if (!params[1]) { return []; }

//     params = params[1].split(/\s*,\s*/);
    
//     for (i = params.length; i--;) {
//         if (!/\$/.test(params[i])) {
//             params.splice(i, 1);
//         }
//     }

//     return params;
// };

getDependencies = function (module) {
    var i,
        params = /\(([^)]+)/.exec(module);

    if (!params[1]) { return []; }

    params = params[1].split(/\s*,\s*/);
    
    params.shift();

    return params;
};

hasDependencies = function (namespace, module) {
    module.unloaded.push({
        namespace: namespace,
        module: module
    });
};

module.modules = {};
module.unloaded = [];
