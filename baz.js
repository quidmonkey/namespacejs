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
