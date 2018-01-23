const once = require('../spies/once.js').once;
const sinon = require('sinon');
const assert = require('assert');

describe('sinon#spy', () => {
  it("calls the original function with right this and args", function () {
    let callback = sinon.spy();
    let proxy = once(callback);

    proxy(1, 2, 3);

    assert(callback.calledWith(1, 2, 3));
  });
});