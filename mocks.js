var Mocks = {
    Foo: function () {
        return {
            x: 1,
            y: 'Hello'
        };
    },

    Bar: function (Foo) {
        return function (name) {
            var str = Foo.y + ' ' + name;
            return str;
        };
    },

    Qux: function (Foo, Baz) {
        return [Foo.y + Baz.delta];
    },

    Empty: function () { return {}; },

    ArrayFactory: function () { return []; },
    FunctionFactory: function () { return function () {}; },
    ObjectFactory: function () { return {}; },

    ModuleOne: function () { return {}; },
    ModuleTwo: function (ModuleOne) { return {}; }
};
