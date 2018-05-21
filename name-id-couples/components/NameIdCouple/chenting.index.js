/**
 * Created by Administrator on 2018/5/21.
 */
$(function(){
    /**
     * 自定义 es6-shim
     * 因为引用 es6-shim 在 ie 8 报错
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
});
/***************************************领导选择******************************************/
/**
 * 整合数据，id和name合成对象
 */
function zip(ids, names) {
    var couples = [];
    ids.forEach(function (id, index) {
        couples.push({ id: id, name: names[index] });
    });
    return couples;
}
/**
 * 删除名字，同时删除 id
 * @param {string} options.el 组件被挂载处
 * @param {Object[]} options.data 含 name id 属性的对象数组
 */
function Couples(options) {
    this.$element = $(options.el);
    // 浅拷贝一份
    this.data = [].concat(options.data);
    this.deleted = options.deleted||jQuery.noop;
    this.render();
    this.reactive();
}

/**
 * 渲染
 */
Couples.prototype.render = function () {
    this.renderContainer();
    this.renderNames();
};

/**
 * 渲染 container
 */
Couples.prototype.renderContainer = function () {
    this.$element.append('<ul id="names"></ul>');
    this.$nameBox = $('#names');
};

/**
 * 渲染名字
 */
Couples.prototype.renderNames = function () {
    var lis = this.data.map(function(couple){
        return '\
    <li data-id="' + couple.id + '">\
      <label> ' + couple.name + ';</label>\
      <span class="icon-delete">X</span>\
    </li>';
    });

    this.$nameBox.html(lis.join(''));
};

/**
 * 绑定事件
 */
Couples.prototype.reactive = function () {
    this.deletable();
    this.deleterHoverable();
};

/**
 * 绑定删除事件
 */
Couples.prototype.deletable = function () {
    var couple = this;
    this.$nameBox.on('click', '.icon-delete', function () {
        var clickedLi = $(this).parent();
        var id = clickedLi.data('id');

        // console.log('delete id#:', id, typeof id);
        // 1. 根据 id 将选中的元素 从 data 中删除
        var index = couple.data.findIndex(function (element) {
            return element.id === id;
        });

        console.log('id in li:', id);
        console.log('couple.data:', couple.data);

        if (index === -1) {
          throw new Error('id=' + id + ' not in data');
        }

        couple.data.splice(index, 1);
        // 2. 将选中的元素从页面删除
        clickedLi.remove();

        couple.deleted(couple.data);
    });
};

/**
 * hover 展示删除按钮
 */
Couples.prototype.deleterHoverable = function () {
    $('#names li').hover(function showOnHover() {
        $(this).children('.icon-delete').toggleClass('show');
    });
};

/**
 * 获取修改后的数据
 */
Couples.prototype.getData = function () {
    return this.data;
};

/**
 * 重新渲染数据
 */
Couples.prototype.setData = function (data) {
    this.data = data;
    this.renderNames();
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

/********************************** 结束 ******************************************/
