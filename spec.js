describe('NamespaceJS: A Lightweight JavaScript Module System', function () {
  var mocks = {
    foo: function mockFoo () { return { x: 1 }; },
    bar: function mockBar (Foo) { return { y: 2 + Foo.x }; },
    baz: function mockBaz (Qux) { return { z: 5 }; },
    namespaceOne: function (namespaceTwo) {},
    namespaceTwo: function (namespaceOne) {}
  };

  beforeEach(function () {
    spyOn(mocks, 'foo').and.callThrough();
    spyOn(mocks, 'bar').and.callThrough();
    spyOn(mocks, 'baz').and.callThrough();
    spyOn(console, 'log');
  });

  it('should define a global debugNamespaces function', function () {
    expect('debugNamespaces' in window).toBeTruthy();
    expect(debugNamespaces).toEqual(jasmine.any(Function));
  });

  it('should define a global getNamespace function', function () {
    expect('getNamespace' in window).toBeTruthy();
    expect(getNamespace).toEqual(jasmine.any(Function));
  });

  it('should define a global namespace function', function () {
    expect('namespace' in window).toBeTruthy();
    expect(namespace).toEqual(jasmine.any(Function));
  });

  it('should define a global registerLibrary function', function () {
    expect('registerLibrary' in window).toBeTruthy();
    expect(registerLibrary).toEqual(jasmine.any(Function));
  });

  it('should create a namespace', function () {
    namespace('Namespace', mocks.foo);
    expect('Namespace' in window).toBeTruthy();
    expect(mocks.foo).toHaveBeenCalled();
  });

  it('should retrieve a namespace from the hash', function () {
    expect(getNamespace('Namespace')).toEqual({ dependencies : [], module : { x : 1 } });
  });

  it('should create a sub-namespace', function () {
    namespace('Namespace.SubNamespace', mocks.foo);
    expect('Namespace' in window).toBeTruthy();
    expect('SubNamespace' in Namespace).toBeTruthy();
    expect(mocks.foo).toHaveBeenCalled();
  });

  it('should create an arbitrary number of sub-namespaces, creating each leaf along the way', function () {
    namespace('I.Am.An.Arbitrary.Namespace', mocks.foo);
    expect('I' in window).toBeTruthy();
    expect('Am' in I).toBeTruthy();
    expect('An' in I.Am).toBeTruthy();
    expect('Arbitrary' in I.Am.An).toBeTruthy();
    expect('Namespace' in I.Am.An.Arbitrary).toBeTruthy();
    expect(mocks.foo).toHaveBeenCalled();
  });

  it('should inject dependencies', function () {
    namespace('Foo', mocks.foo);
    namespace('Bar', ['Foo'], mocks.bar);
    expect(mocks.bar).toHaveBeenCalledWith(Foo);
  });

  it('should register libraries and remove from global scope', function () {
    window.$ = function mockjQuery () {};

    expect('$' in window).toBeTruthy();
    registerLibrary('Foo.$', $);
    expect('$' in Foo).toBeTruthy();
    expect('$' in window).toBeFalsy();
  });

  it('should remove registered library from the global scope if being namespaced to the global scope', function () {
    window.$ = function mockjQuery () {};

    expect('$' in window).toBeTruthy();
    registerLibrary('myJquery', $);
    expect('myJquery' in window).toBeTruthy();
    expect('$' in window).toBeFalsy();
  });

  it('should debug namespaces', function () {
    var mockDebug = { closure: mocks.baz, dependencies: ['Qux'], namespace: 'Baz' };

    namespace('Baz', ['Qux'], mocks.baz);

    expect(mocks.baz).not.toHaveBeenCalled();

    expect(debugNamespaces()).toEqual([mockDebug]);
    expect(console.log).toHaveBeenCalledWith('~~~~ namespacejs: Debug Mode - Unloaded Modules');
    expect(console.log).toHaveBeenCalledWith('1) Namespace: Baz with Dependencies: Qux');
  });

  it('should generate a warning on duplicate namespace', function () {
    console.log(getNamespace('Foo'));
    namespace('Foo', mocks.foo);

    expect(console.log).toHaveBeenCalledWith('~~~~ namespacejs: Ruh roh. Namespace collision on \'Foo\'. Not registering module.');
  });

  it('should warn about bad capitilization practices', function () {
    namespace('bad.practice', mocks.foo);
    expect(console.log).toHaveBeenCalled();    
    expect(console.log).toHaveBeenCalledWith('~~~~ namespacejs: Ruh roh. It is best practice to capitalize \'practice\' in namespace \'bad.practice\' to avoid naming collisions.');
  });

  it('should throw an error on circular dependencies', function () {
      var wrappedModule = function () { namespace('Namespace.Two', ['Namespace.One'], mocks.namespaceOne); };
      namespace('Namespace.One', ['Namespace.Two'], mocks.namespaceTwo);
      expect(wrappedModule).toThrow(new Error('~~~~ namespacejs: Ruh roh. Unable to load \'Namespace.Two\' because it has a circular dependency on \'Namespace.One\''));
  });
});
