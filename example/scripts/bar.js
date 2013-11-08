module('Foo.Bar', function (global, Foo) {
    var x = 2;
    this.x = 2;
    console.log('\n~~~~ Bar scope');
    console.log('x: ' + x);
    console.log('this.x: ' + this.x);
    console.log('global:', global);
    console.log('Foo:', Foo);
    console.log('this:', this);
    console.log('Is this Bar from Foo? ' + (this === Foo.Bar));
    console.log('Is this Bar globally? ' + (this === global.Foo.Bar));
});