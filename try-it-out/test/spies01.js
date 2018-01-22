const once = require('../spies/once.js').once;
const sinon = require('sinon');

describe('sinon#spy', () => {
  it("calls the original function", function () {
    let callback = sinon.spy();
    let proxy = once(callback);

    proxy();

    sinon.assert.calledOnce(callback);
  });
});