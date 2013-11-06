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