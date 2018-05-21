/**
 * 删除名字，同时删除 id
 * dependencies: { jquery: ^1.7.0 }
 *
 * @param {string} options.el 组件被挂载处
 * @param {Object[]} options.data 含 name id 属性的对象数组
 */
function Couples(options) {
  this.$element = $(options.el);
  // 浅拷贝一份
  this.data = [].concat(options.data);
  this.deleted = options.deleted || jQuery.noop;

  // console.log('options:', JSON.stringify(options, null, 2));

  this.render();
  this.reactive();
}

/**
 * 渲染
 *
 * @private
 * @return {void}
 */
Couples.prototype.render = function () {
  this.renderContainer();
  this.renderNames();
};

/**
 * 渲染 container
 *
 * @private
 * @return {void}
 */
Couples.prototype.renderContainer = function () {
  this.$element.append('<ul id="names"></ul>');
  this.$nameBox = $('#names');
};

/**
 * 渲染名字
 *
 * @private
 * @return {void}
 */
Couples.prototype.renderNames = function () {
  const lis = this.data.map(function (couple) {
    return '\
    <li data-id="' + couple.id + '">\
      <label> ' + couple.name + '；</label>\
      <span class="icon-delete">×</span>\
    </li>';
  });

  this.$nameBox.html(lis.join(''));
};

/**
 * 绑定事件
 *
 * @private
 * @return {void}
 */
Couples.prototype.reactive = function () {
  this.deletable();
  this.deleterHoverable();
};

/**
 * 绑定删除事件
 *
 * @private
 * @return {void}
 */
Couples.prototype.deletable = function () {
  const couple = this;

  this.$element.on('click', '.icon-delete', function () {
    const clickedLi = $(this).parent();

    const id = clickedLi.data('id');
    console.log('delete id#:', id, typeof id);

    // 1. 根据 id 将选中的元素 从 data 中删除
    const index = couple.data.findIndex(function (element) {
      return element.id === id;
    });

    if (index === -1) {
      throw new RangeError('id ' + id + ' not in data: ' + JSON.stringify(couple.data));
    }

    couple.data.splice(index, 1);

    // 2. 将选中的元素从页面删除
    clickedLi.remove();

    couple.deleted(couple.data);
  });
};

/**
 * hover 展示删除按钮
 *
 * @private
 * @return {void}
 */
Couples.prototype.deleterHoverable = function () {
  this.$element.find('li').hover(function showOnHover() {
  // this.$element.on('hover', 'li', function showOnHover() {
    $(this).children('.icon-delete').toggleClass('show');
  });
};

/**
 * 获取修改后的数据
 *
 * @public
 * @return {Object[]}
 */
Couples.prototype.getData = function () {
  return this.data;
};

/**
 * 设置数据，会重新 render
 *
 * @public
 * @param {Object[]} data
 * @return {Couples}
 */
Couples.prototype.setData = function (data) {
  this.data = data;

  this.renderNames();
  // ie 8 hover 没法冒泡，具体原因未查
  this.deleterHoverable();

  return this;
};

/**
 * 清空所有的数据
 * @return {Couples}
 */
Couples.prototype.clear = function () {
  this.setData([]);

  return this;
};
