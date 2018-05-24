/**
 * 模仿微信带字数限制的输入框
 * @param {HTMLInputElement} input 必须包含属性 counter-input counter-input-max
 *
 * @example
 * <input type="text" counter-input counter-input-max="21" counter-input-exceeding-warning="请正确输入视频标题">
 */
function CounterInput(input) {
  this.input = input;
  this.maxLength = parseInt(input.getAttribute('counter-input-max'), 10);
  this.warning = input.getAttribute('counter-input-exceeding-warning') || '字数已超上限';

  this.render();
  this.react()
}

/**
 * 渲染
 * @return {CounterInput}
 */
CounterInput.prototype.render = function () {
  const parentNode = this.input.parentNode;

  // 标识其是一个带字数限制的输入框，渲染成特定的样式
  this.input.classList.add('counter-input');

  // 用 wrapper 将 input 包起来，方便写样式
  this.wrapper = document.createElement('div');
  this.wrapper.classList.add('counter-input-wrapper');
  this.wrapper.appendChild(this.input);

  // 增加计数器
  this.counter = document.createElement('span');
  this.counter.classList.add('counter');
  this.setWordCount();
  this.wrapper.appendChild(this.counter);

  // 增加超字数限制的提示
  this.warningPanel = document.createElement('p');
  this.warningPanel.textContent = this.warning;
  this.warningPanel.classList.add('warning-panel');
  this.wrapper.appendChild(this.warningPanel);

  parentNode.appendChild(this.wrapper);

  return this;
};

/**
 * 绑定事件
 * @return {CounterInput}
 */
CounterInput.prototype.react = function () {
  const that = this;

  this.input.addEventListener('input', function handleInput() {
    that.setWordCount();

    const length = that.getLength();

    // “超限制”或“必填字段，但长度却为零”则显示报错信息
    if (length > that.maxLength || (that.input.required && length === 0)) {
      that.showWarning();
    } else {
      that.hideWarning();
    }
  });

  return this;
};

/**
 * 显示已输入的字数和字数上限
 * @return {CounterInput}
 */
CounterInput.prototype.setWordCount = function () {
  this.counter.textContent = `${this.input.value.length} / ${this.maxLength}`;

  return this;
};

/**
 * 获取输入的文字长度
 * @return {number}
 */
CounterInput.prototype.getLength = function () {
  return this.input.value.length;
}

/**
 * 显示报错信息
 * @return {CounterInput}
 */
CounterInput.prototype.showWarning = function () {
  this.wrapper.classList.add('warning-excedding');

  return this;
};

/**
 * 隐藏报错信息
 * @return {CounterInput}
 */
CounterInput.prototype.hideWarning = function () {
  this.wrapper.classList.remove('warning-excedding');

  return this;
};

Array.from(document.querySelectorAll('input[counter-input]')).forEach(function renderAll(input) {
  const maxLength = parseInt(input.getAttribute('counter-input-max'), 10);

  if (Number.isNaN(maxLength)) {
    // 不是一个有效的字数限制，则不管，将其当做一个普通的输入框
  } else {
    new CounterInput(input);
  }
});
