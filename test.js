// each module should be in its own .js file
// to properly separate your code
// but all are listed here for demonstration purposes
module('foo', function (global) {
    var x = 1;
    this.x = 1;
    console.log(x);
    console.log(this.x);
    console.log(this);
    console.log(this === global.foo);
});

module('foo.bar', function (global) {
    var x = 2;
    this.x = 2;
    console.log(x);
    console.log(this.x);
    console.log(this);
    console.log(this === global.foo.bar);
});

module('foo.bar.baz', function (global) {
    var x = 3;
    this.x = 3;
    console.log(x);
    console.log(this.x);
    console.log(this);
    console.log(this === global.foo.bar.baz);
});

module('foo.bar.baz', function () {});  // generate warning

console.log(this.foo);
console.log(this.foo.bar);
console.log(this.foo.bar.baz);
