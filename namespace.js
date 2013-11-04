module = function (namespace, module) {
    var global = global || window,
        key,
        leaf,
        root = global,
        tree;

    tree = namespace.split('.');

    while (tree.length) {
        leaf = tree.shift();
        root = root[leaf] = root[leaf] || {};
    }

    // empty object?
    for (key in root) {
        console.log('~~~~ namespacejs: Ruh roh. Potential namespace collision on ' + namespace);
        break;
    }

    module.call(root, global);
}
