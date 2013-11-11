module('Foo', function () {
    var x = 1;
    this.x = 1;
    console.log('~~~~ Foo scope');
    console.log('x: ' + x);
    console.log('this.x: ' + this.x);
    console.log('this:', this);
});
