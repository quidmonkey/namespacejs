(function (global) {
    module = function (namespace, closure) {
        var key,
            leaf = global,
            name,
            root,
            tree = namespace.split('.');

        while (tree.length) {
            name = tree.shift();

            // is capitalized to conform to best practice of naming modules?
            if (/[^A-Z]/.test(name[0])) {
                console.log(
                    '~~~~ namespacejs: Ruh roh. It is best practice to capitalize \'' + name +
                    '\' in namespace \'' + namespace + '\' to avoid naming collisions.'
                );
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

        closure.call(leaf, global, root);
    };
})(this);
