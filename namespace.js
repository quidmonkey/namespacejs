module = function (namespace, module) {
    var global = global || window,
        key,
        leaf = global,
        name,
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
    for (key in leaf) {
        if (leaf.hasOwnProperty(key)) {
            console.log('~~~~ namespacejs: Ruh roh. Potential namespace collision on \'' + namespace +'\'');
            break;
        }
    }

    module.call(leaf, global, root);
};
