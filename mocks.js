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

    ObjectFactory: function () { return {}; },
    FunctionFactory: function () { return function () {}; },
    ArrayFactory: function () { return []; } 
};
