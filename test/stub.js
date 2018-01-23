const once = require('../once.js').once;

const assert = require('assert');
const sinon = require('sinon');

describe('stub', () => {
  describe('#returns', () => {
    it('returns the return value from the original function', () => {
      let callback = sinon.stub().returns(42);
      let proxy = once(callback);

      assert.equal(proxy(), 42);
    });
  });
  describe('#throws', () => {
    it('test should call all subscribers, even if there are exceptions', () => {
      let stub = sinon.stub().throws();
      let onceStub = once(stub);
      let onceSpy = sinon.spy(once);

      try {
        onceStub();
      } catch (error) {
        //console.log(error);
      }
      onceSpy(1, 2, 3);

      assert(onceSpy.called);
      assert(stub.calledBefore(onceSpy));
    });
  });
  describe('#withArgs', () => {
    it('test should stub method differently based on arguments',
      function () {
        let callback = sinon.stub();
        callback.withArgs(42).returns(1);
        callback.withArgs(1).throws("TypeError");

        callback(); // No return value, no exception
        assert.equal(callback(42), 1); // Returns 1

        try {
          callback(1); // Throws TypeError
        } catch (error) {
          assert.equal(error, "TypeError");
        }
      });
  });
  describe('#onCall(n)', () => {
    it("test should stub method differently on consecutive calls", function () {
      let callback = sinon.stub();
      callback.onCall(0).returns(1);
      callback.onCall(1).returns(2);
      callback.returns(3);

      assert.equal(callback(), 1); // Returns 1
      assert.equal(callback(), 2); // Returns 2
      assert.equal(callback(), 3); // All following calls return 3
    });
  });
  describe('#onFirstCall,onSecondCall,onThirdCall', () => {
    it("test should stub method differently on consecutive calls with certain argument", function () {
      let callback = sinon.stub();
      callback.withArgs(42)
        .onFirstCall().returns(1)
        .onSecondCall().returns(2)
        .onThirdCall().returns(3);
      callback.returns(0);

      assert.equal(callback(1), 0); // Returns 0
      assert.equal(callback(42), 1); // Returns 1
      assert.equal(callback(1), 0); // Returns 0
      assert.equal(callback(42), 2); // Returns 2
      assert.equal(callback(1), 0); // Returns 0
      assert.equal(callback(42), 3); // Returns 3 
      assert.equal(callback(42), 0); // Returns 0 
    });
  });
  describe('#resetBehavior', () => {
    it('should reset stub', () => {
      let stub = sinon.stub().returns(54);
      assert(stub(), 54);

      stub.resetBehavior();
      assert.equal(stub(), undefined);
    });
  });
  describe('#resetHistory', () => {
    it('should reset history of the stub', () => {
      let stub = sinon.stub();
      assert(!stub.called);

      stub();
      assert(stub.called);

      stub.resetHistory();
      assert(!stub.called);
    });
  });
  describe('#callsFake(fakeFunc)', () => {
    it("replace with obj's method with the fake one", () => {
      let obj = {
        prop() {
          return 'foo';
        }
      };
      // Makes the stub call the provided fakeFunction when invoked.
      sinon.stub(obj, 'prop').callsFake(() => {
        return 'bar';
      });

      assert(obj.prop(), 'bar');
    });
  });
  describe('#callThrough', () => {
    it("should replace obj's method conditionally", () => {
      let obj = {
        sum(a, b) {
          return a + b;
        }
      };

      let stub = sinon.stub(obj, 'sum');
      obj.sum.withArgs(2, 2).callsFake(() => 'bar');
      obj.sum.callThrough();

      assert.equal(obj.sum(2, 2), 'bar');
      assert.equal(obj.sum(1, 2), 3);
    });
  });
  describe('#yieldsTo', () => {
    it("test should fake successful world request", function () {
      let obj = {
        hello(world) {}
      }
      sinon.stub(obj, "hello").yieldsTo("success", [1, 2, 3]);

      obj.hello({
        success(data) {
          assert.deepEqual([1, 2, 3], data);
        }
      });
    });
  });
  describe('#yieldTo', () => {
    it("invokes callbacks passed as a property of an object to the stub", () => {
      let callback = sinon.stub();

      callback({
        success() {
          console.log("Success!");
        },
        //"failure": function () {
        failure() {
          console.log("Oh, noes!");
        }
      });

      callback.yieldTo("failure"); // Oh, noes!
    });
  });
  describe('#callArg', () => {
    it("calls the last callback", () => {
      let callback = sinon.stub();

      callback(() => console.log("Success!"),
        () => console.log("Oh, noes!"));

      callback.callArg(1);
    });
  });
  describe('#addBehavior', () => {
    it('adds behavior to stub', () => {
      sinon.addBehavior('returnsNum', (fake, n) => fake.returns(n));

      let stub = sinon.stub().returnsNum(42);
      assert.equal(stub(), 42);
    });
  });
  describe('#get,set', () => {
    it('tests getter and setter replacement on stub', () => {
      let obj = {
        example: 'oldValue',
        prop: 'foo',
      };

      sinon.stub(obj, 'prop').get(() => 'bar');
      sinon.stub(obj, 'prop').set(val => {
        obj.example = val;
      });

      obj.prop = 'baz';

      assert.equal(obj.prop, 'bar');
      assert.equal(obj.example, 'baz');
    });
  });
  describe('#value,restore', () => {
    it('tests value()', () => {
      let obj = {
        example: 'oldValue',
      };

      let stub = sinon.stub(obj, 'example').value('newValue');

      assert.equal(obj.example, 'newValue');

      stub.restore();
      assert.equal(obj.example, 'oldValue');
    });
  });
});