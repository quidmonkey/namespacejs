module('I.Am.An.Arbitrary.Namespace', function (Baz) {
    console.log('\n~~~~ Namespace Scope');
    console.log('I can haz Baz?', Baz);
});

console.log('\n~~~~ Warnings');
module('bad.practice', function () {}); // generate non-capitalized warning

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

module('Foo.Bar.Baz', function () {});  // generate conflict warning
