module('Foo', function (global) {
    var x = 1;
    this.x = 1;
    console.log('~~~~ Foo scope');
    console.log('x: ' + x);
    console.log('this.x: ' + this.x);
    console.log('global:', global);
    // console.log('parent:', parent);
    console.log('this:', this);
    // console.log('Is this Foo from parent? ' + (this === parent.Foo));
    console.log('Is this Foo globally? ' + (this === global.Foo));
});
