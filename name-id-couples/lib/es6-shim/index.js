/**
 * 自定义 es6-shim
 * 因为 es6-shim 在 ie 8 报错 console 为定义，不想解决了，故自己写 shim
 */
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function (predict) {
    var index = -1;

    for (var i = 0; i < this.length; i += 1) {
      if (predict(this[i])) {
        index = i;
        break;
      }
    }

    return index;
  }
}
