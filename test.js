// each module should be in its own .js file
// to properly separate your code
// but all are listed here for demonstration purposes
module('foo', function (global, parent) {
    var x = 1;
    this.x = 1;
    console.log('~~~~ foo scope');
    console.log('x: ' + x);
    console.log('this.x: ' + this.x);
    console.log('global:', global);
    console.log('parent:', parent);
    console.log('this:', this);
    console.log('Is this foo from parent? ' + (this === parent.foo));
    console.log('Is this foo globally? ' + (this === global.foo));
});

module('foo.bar', function (global, parent) {
    var x = 2;
    this.x = 2;
    console.log('\n~~~~ bar scope');
    console.log('x: ' + x);
    console.log('this.x: ' + this.x);
    console.log('global:', global);
    console.log('parent:', parent);
    console.log('this:', this);
    console.log('Is this bar from parent? ' + (this === parent.bar));
    console.log('Is this bar globally? ' + (this === global.foo.bar));
});

module('foo.bar.baz', function (global, parent) {
    var x = 3;
    this.x = 3;
    console.log('\n~~~~ baz scope');
    console.log('x: ' + x);
    console.log('this.x: ' + this.x);
    console.log('global:', global);
    console.log('parent:', parent);
    console.log('this:', this);
    console.log('Is this baz from parent? ' + (this === parent.baz));
    console.log('Is this baz globally? ' + (this === global.foo.bar.baz));
});

module('i.am.an.arbitrary.namespace', function (global, parent) {});

module('foo.bar.baz', function (global, parent) {});  // generate warning

console.log('\n~~~~ global scope');
console.log('Is x undefined? ' + (typeof x === 'undefined'));
console.log('this.x: ' + this.x);
console.log('this:', this);
console.log('foo:', this.foo);
console.log('bar:', this.foo.bar);
console.log('baz:', this.foo.bar.baz);
console.log('i:', this.i);
console.log('am:', this.i.am);
console.log('an:', this.i.am.an);
console.log('arbitrary:', this.i.am.an.arbitrary);
console.log('namespace:', this.i.am.an.arbitrary.namespace);
