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
        root = leaf;
        leaf = root[name] = root[name] || {};
    }

    // empty object?
    for (key in leaf) {
        console.log('~~~~ namespacejs: Ruh roh. Potential namespace collision on ' + namespace);
        break;
    }

    module.call(leaf, global, root);
};
