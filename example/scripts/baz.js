module('Foo.Bar.Baz', function (Bar) {
    var x = 3;
    this.x = 3;
    console.log('\n~~~~ Baz scope');
    console.log('x: ' + x);
    console.log('this.x: ' + this.x);
    console.log('Bar:', Bar);
    console.log('this:', this);
    console.log('Is this Baz from Bar? ' + (this === Bar.Baz));
});
