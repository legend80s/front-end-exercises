/**
 * 删除名字，同时删除 id
 * dependencies: { jquery: ^1.7.0 }
 *
 * @param {string} options.el 组件被挂载处
 * @param {Object[]} options.labels 含 name id 属性的对象数组
 * @param {Function} options.deleted 删除一个元素的回调函数，形参是刚删除的元素
 * @param {Function} options.added 新增一个元素的回调函数，形参是刚新增的元素
 * @param {Number} options.maxLabelCount 标签数上限
 * @param {string=opensearch} options.type 样式：opensearch | wechat
 */
function DeletableLabels(options) {
  this.$element = $(options.el);
  // 浅拷贝一份
  this.labels = [].concat(options.labels);
  this.deleted = options.deleted || jQuery.noop;
  this.added = options.added || jQuery.noop;
  this.maxLabelCount = options.maxLabelCount || DeletableLabels.MAX_LABEL_COUNT;
  this.type = DeletableLabels.TYPES.includes(options.type) ? options.type : DeletableLabels.OPENSEARCH;

  // console.log('options:', JSON.stringify(options, null, 2));

  this.render();
  this.react();
}

/**
 * 渲染
 *
 * @private
 * @return {void}
 */
DeletableLabels.prototype.render = function () {
  this.renderContainer();
  this.renderNames();
};

/**
 * 渲染 container
 *
 * @private
 * @return {void}
 */
DeletableLabels.prototype.renderContainer = function () {
  this.$element.append(`
    <div id="deletable-labels-wrapper" class="deletable-labels deletable-labels-${this.type}">
      <ul id="names"></ul>

      ${this.isWechatType() ? '<input type="text" class="input-deleter" />' : ''}
    </div>
  `);

  this.$wrapper = $('#deletable-labels-wrapper');
  this.$nameBox = $('#names');
  this.$input = this.$wrapper.children('.input-deleter');
};

/**
 * 渲染名字
 *
 * @private
 * @return {void}
 */
DeletableLabels.prototype.renderNames = function () {
  const lis = this.labels.map(function (label) {
    return `
    <li data-id="${label.id}">\
      <label>${label.name}</label>\
      <span class="icon-delete">×</span>\
    </li>`;
  });

  this.$nameBox.html(lis.join(''));
};

/**
 * 绑定事件
 *
 * @private
 * @return {void}
 */
DeletableLabels.prototype.react = function () {
  this.deletable();

  if (this.isWechatType()) {
    this.inputReact();
  }
};

/**
 * 绑定删除事件
 *
 * @private
 * @return {void}
 */
DeletableLabels.prototype.deletable = function () {
  const that = this;

  this.$element.on('click', '.icon-delete', function () {
    const clickedLi = $(this).parent();

    const id = clickedLi.data('id');
    console.log('delete id#:', id, typeof id);

    that.remove({ id: id, name: clickedLi.children('label')[0].textContent });
  });
};

/**
 * 为输入框绑定事件 - WeChat 样式
 * @return {DeletableLabels}
 */
DeletableLabels.prototype.inputReact = function () {
    this.clickToFocusInput();
    this.deleteByIput();
    this.addByInput();

    return this;
};

/**
 * 点击组件右侧区域光标自动进入 input - WeChat 样式
 *
 * @private
 * @return {void}
 */
DeletableLabels.prototype.clickToFocusInput = function () {
  const input = this.$input[0];

  this.$wrapper.on('click', function activateInput() {
    input.focus();
  })
};

/**
 * 输入框中按 Del 或 Backspace 键可删除 label - WeChat 样式
 *
 * @private
 * @return {void}
 */
DeletableLabels.prototype.deleteByIput = function () {
  this.$input.on('keydown', ($event) => {
    if ($event.which === DeletableLabels.KEY_CODE_DELETE && this.$input.val().length === 0) {
      const lastOne = this.labels[this.labels.length - 1];

      if (lastOne) {
        this.remove(lastOne);
      }
    };
  });
};

/**
 * 输入框中按 Enter 新增 label - WeChat 样式
 *
 * @private
 * @return {void}
 */
DeletableLabels.prototype.addByInput = function () {
  this.$input.on('keydown', ($event) => {
    if ($event.which === DeletableLabels.KEY_CODE_ENTER && this.$input.val().length !== 0) {
      this.add({ name: this.$input.val() });
    };
  });
};

/**
 * 是否是 WeChat 样式
 * @return {Boolean}
 */
DeletableLabels.prototype.isWechatType = function () {
  return this.type === DeletableLabels.WECHAT;
};

/**
 * 删除一个 label，页面和数据都会被删除
 * @param  {Object} label 必须包含 id
 * @return {DeletableLabels}
 */
DeletableLabels.prototype.remove = function ({ id, name }) {
  // 1. 根据 id 将选中的元素 从 labels 中删除
  const index = this.labels.findIndex(function (label) {
    return label.id === id;
  });

  if (index === -1) {
    throw new RangeError('id ' + id + ' not in labels: ' + JSON.stringify(this.labels));
  }

  this.labels.splice(index, 1);

  // 2. 将选中的元素从页面删除
  $(`li[data-id="${id}"]`).remove();

  // 回调函数
  this.deleted({ id, name });

  return this;
};

/**
 * 新增一个 label，页面和数据都会新增
 * @param  {Object} label 必须包含 name，id 可选，若没有则自动递增一个
 * @return {DeletableLabels}
 */
DeletableLabels.prototype.add = function ({ name, id }) {
  if (!this.labels.find((label) => label.id === id)) {
    if (this.labels.length >= this.maxLabelCount) {
      alert(`最多 ${this.maxLabelCount} 个标签`);
      return this;
    }

    if (typeof id === 'undefined') {
      const ids = this.labels.map((label) => label.id)

      maxId = ids.length === 0 ? -1 : Math.max.apply(null, ids);
      // 等价于
      // id = Math.max(...this.labels.map((label) => label.id));

      id = maxId + 1;
    }

    const newly = { name, id };

    this.labels.push(newly);

    this.$nameBox.append(`
      <li data-id="${id}">
        <label>${name}</label>
        <span class="icon-delete">×</span>
      </li>
    `);

    // 回调函数
    this.added(newly);

    // 清空 input 等待下次输入
    this.$input.val('');
  }

  return this;
};


/**
 * 获取修改后的数据
 *
 * @public
 * @return {Object[]}
 */
DeletableLabels.prototype.getLabels = function () {
  return this.labels;
};

/**
 * 设置数据，会重新 render
 *
 * @public
 * @param {Object[]} labels
 * @return {DeletableLabels}
 */
DeletableLabels.prototype.setLabels = function (labels) {
  this.labels = labels;

  this.renderNames();

  return this;
};

/**
 * 清空所有的数据
 * @return {DeletableLabels}
 */
DeletableLabels.prototype.clear = function () {
  this.setLabels([]);

  return this;
};

DeletableLabels.TYPES = ['opensearch', 'wechat'];
DeletableLabels.OPENSEARCH = DeletableLabels.TYPES[0];
DeletableLabels.WECHAT = DeletableLabels.TYPES[1];

DeletableLabels.KEY_CODE_DELETE = 8;
DeletableLabels.KEY_CODE_ENTER = 13;

DeletableLabels.MAX_LABEL_COUNT = 5;
