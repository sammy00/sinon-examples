const once = require('../spies/once.js').once;
const sinon = require('sinon');
const assert = sinon.assert;

describe('sinon#spy', () => {
  it("calls the original function with right this and args", function () {
    let callback = sinon.spy();
    let proxy = once(callback);
    let obj = {};

    proxy.call(obj, 1, 2, 3);

    assert.calledOn(callback, obj);
    assert.calledWith(callback, 1, 2, 3);
  });
});