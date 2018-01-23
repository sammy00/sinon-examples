const once = require('../spies/once.js').once;
const sinon = require('sinon');
const assert = require('assert');

describe('sinon#spy', () => {
  it("calls the original function with right this and args", function () {
    let callback = sinon.spy();
    let proxy = once(callback);

    proxy(1, 2, 3);

    assert.equal(1, callback.args[0][0]);
    assert.equal(1, callback.getCall(0).args[0]);
  });
});