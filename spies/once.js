exports.once = function (fn) {
  //function once(fn) {
  let returnValue, called = false;

  return function (...args) {
    if (!called) {
      called = true;
      returnValue = fn.apply(this, args);
    }
    return returnValue;
  }
}