/**
 * 模仿微信带字数限制的输入框
 * @param {HTMLInputElement} input 必须包含属性 counter-input counter-input-max
 *
 * @example
 * <input
 *   type="text"
 *   counter-input
 *   counter-input-max="21"
 *   counter-input-exceeding-warning="请正确输入视频标题"
 *   required
 * />
 */
class CounterInput {
  constructor(input) {
    this.input = input;
    this.maxLength = parseInt(input.getAttribute('counter-input-max'), 10);
    this.warning = input.getAttribute('counter-input-exceeding-warning') || '字数已超上限';

    this.render();
    this.react();
  }

  /**
   * 渲染
   * @return {CounterInput}
   */
  render() {
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
  }

  /**
   * 绑定事件
   * @return {CounterInput}
   */
  react() {
    this.input.addEventListener('input', () => {
      this.setWordCount();

      const length = this.getLength();

      // “超限制”或“必填字段，但长度却为零”则显示报错信息
      if (length > this.maxLength || (this.input.required && length === 0)) {
        this.showWarning();
      } else {
        this.hideWarning();
      }
    });

    return this;
  }

  /**
   * 显示已输入的字数和字数上限
   * @return {CounterInput}
   */
  setWordCount() {
    this.counter.textContent = `${this.input.value.length} / ${this.maxLength}`;

    return this;
  }

  /**
   * 获取输入的文字长度
   * @return {number}
   */
  getLength() {
    return this.input.value.length;
  }

  /**
   * 显示报错信息
   * @return {CounterInput}
   */
  showWarning() {
    this.wrapper.classList.add('warning-excedding');

    return this;
  }

  /**
   * 隐藏报错信息
   * @return {CounterInput}
   */
  hideWarning() {
    this.wrapper.classList.remove('warning-excedding');

    return this;
  }
}

// Render all the counter-input in the document
Array.from(document.querySelectorAll('input[counter-input]')).forEach((input) => {
  const maxLength = parseInt(input.getAttribute('counter-input-max'), 10);

  if (Number.isNaN(maxLength)) {
    // 不是一个有效的字数限制，则不管，将其当做一个普通的输入框
  } else {
    new CounterInput(input);
  }
});
