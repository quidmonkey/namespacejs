// each module should be in its own .js file
// to properly separate your code
// but all are listed here for demonstration purposes
module('Foo', function (global, parent) {
    var x = 1;
    this.x = 1;
    console.log('~~~~ Foo scope');
    console.log('x: ' + x);
    console.log('this.x: ' + this.x);
    console.log('global:', global);
    console.log('parent:', parent);
    console.log('this:', this);
    console.log('Is this Foo from parent? ' + (this === parent.Foo));
    console.log('Is this Foo globally? ' + (this === global.Foo));
});

module('Foo.Bar', function (global, parent) {
    var x = 2;
    this.x = 2;
    console.log('\n~~~~ Bar scope');
    console.log('x: ' + x);
    console.log('this.x: ' + this.x);
    console.log('global:', global);
    console.log('parent:', parent);
    console.log('this:', this);
    console.log('Is this Bar from parent? ' + (this === parent.Bar));
    console.log('Is this Bar globally? ' + (this === global.Foo.Bar));
});

module('Foo.Bar.Baz', function (global, parent) {
    var x = 3;
    this.x = 3;
    console.log('\n~~~~ Baz scope');
    console.log('x: ' + x);
    console.log('this.x: ' + this.x);
    console.log('global:', global);
    console.log('parent:', parent);
    console.log('this:', this);
    console.log('Is this Baz from parent? ' + (this === parent.Baz));
    console.log('Is this Baz globally? ' + (this === global.Foo.Bar.Baz));
});

module('I.Am.An.Arbitrary.Namespace', function (global, parent) {});

console.log('\n~~~~ Warnings');
module('bad.practice', function (global, parent) {}); // generate non-capitalized warning

module('Foo.Bar.Baz', function (global, parent) {});  // generate conflict warning

console.log('\n~~~~ global scope');
console.log('Is x undefined? ' + (typeof x === 'undefined'));
console.log('this.x: ' + this.x);
console.log('this:', this);
console.log('Foo:', this.Foo);
console.log('Bar:', this.Foo.Bar);
console.log('Baz:', this.Foo.Bar.Baz);
console.log('I:', this.I);
console.log('Am:', this.I.Am);
console.log('An:', this.I.Am.An);
console.log('Arbitrary:', this.I.Am.An.Arbitrary);
console.log('Namespace:', this.I.Am.An.Arbitrary.Namespace);
console.log('bad:', this.bad);
console.log('practice:', this.bad.practice);
