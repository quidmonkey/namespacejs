describe('NamespaceJS: A Lightweight JavaScript Module System', function () {
  beforeEach(function () {
    spyOn(Mocks, 'Foo').and.callThrough();
    spyOn(Mocks, 'Bar').and.callThrough();
    spyOn(Mocks, 'Qux').and.callThrough();
    spyOn(Mocks, 'Empty').and.callThrough();
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
    namespace('MyNamespace', Mocks.Empty);
    expect('MyNamespace' in window).toBeTruthy();
    expect(Mocks.Empty).toHaveBeenCalled();
  });

  it('should retrieve a namespace from the hash', function () {
    expect(getNamespace('MyNamespace')).toEqual({ dependencies : [], module : {} });
  });

  it('should create a sub-namespace', function () {
    namespace('MyNamespace.MySubNamespace', Mocks.Empty);
    expect('MyNamespace' in window).toBeTruthy();
    expect('MySubNamespace' in MyNamespace).toBeTruthy();
    expect(Mocks.Empty).toHaveBeenCalled();
  });

  it('should create an arbitrary number of sub-namespaces, creating each leaf along the way', function () {
    namespace('I.Am.An.Arbitrary.Namespace', Mocks.Empty);
    expect('I' in window).toBeTruthy();
    expect('Am' in I).toBeTruthy();
    expect('An' in I.Am).toBeTruthy();
    expect('Arbitrary' in I.Am.An).toBeTruthy();
    expect('Namespace' in I.Am.An.Arbitrary).toBeTruthy();
    expect(Mocks.Empty).toHaveBeenCalled();
  });

  it('should allow object factory pattern namespaces to be defined', function () {
    namespace('ExampleObjectFactory', Mocks.ObjectFactory);
    expect(ExampleObjectFactory).toEqual(jasmine.any(Object));
  });

  it('should allow function factory pattern namespaces to be defined', function () {
    namespace('ExampleFunctionFactory', Mocks.FunctionFactory);
    expect(ExampleFunctionFactory).toEqual(jasmine.any(Function));
  });

  it('should allow array factory pattern namespaces to be defined', function () {
    namespace('ExampleArrayFactory', Mocks.ArrayFactory);
    expect(ExampleArrayFactory).toEqual(jasmine.any(Array));
  });

  it('should create a object namespace with attributes', function () {
    namespace('Foo', Mocks.Foo);
    expect(Foo).toEqual(jasmine.any(Object));
    expect(Foo.x).toEqual(1);
    expect(Foo.y).toEqual('Hello');
  });

  it('should inject dependencies', function () {
    namespace('Bar', ['Foo'], Mocks.Bar);
    expect(Mocks.Bar).toHaveBeenCalledWith(Foo);
    expect(Bar).toEqual(jasmine.any(Function));
    expect(Bar('Joe')).toEqual('Hello Joe');
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
    var mockDebug = { closure: Mocks.Qux, dependencies: ['Foo', 'Baz'], namespace: 'Qux' };

    namespace('Qux', ['Foo', 'Baz'], Mocks.Qux);

    expect(Mocks.Qux).not.toHaveBeenCalled();

    expect(debugNamespaces()).toEqual([mockDebug]);
    expect(console.log).toHaveBeenCalledWith('~~~~ namespacejs: Debug Mode - Unloaded Modules');
    expect(console.log).toHaveBeenCalledWith('1) Namespace: Qux with Dependencies: Foo,Baz');
  });

  it('should generate a warning on duplicate namespace', function () {
    console.log(getNamespace('Foo'));
    namespace('Foo', Mocks.Empty);

    expect(console.log).toHaveBeenCalledWith('~~~~ namespacejs: Ruh roh. Namespace collision on \'Foo\'. Not registering module.');
  });

  it('should warn about bad capitilization practices', function () {
    namespace('bad.practice', Mocks.Empty);
    expect(console.log).toHaveBeenCalled();    
    expect(console.log).toHaveBeenCalledWith('~~~~ namespacejs: Ruh roh. It is best practice to capitalize \'practice\' in namespace \'bad.practice\' to avoid naming collisions.');
  });

  it('should throw an error on circular dependencies', function () {
      var wrappedModule = function () { namespace('Namespace.Two', ['Namespace.One'], Mocks.Empty); };
      namespace('Namespace.One', ['Namespace.Two'], Mocks.Empty);
      expect(wrappedModule).toThrow(new Error('~~~~ namespacejs: Ruh roh. Unable to load \'Namespace.Two\' because it has a circular dependency on \'Namespace.One\''));
  });
});
