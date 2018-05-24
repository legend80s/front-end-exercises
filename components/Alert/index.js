class Alert {
  constructor(alert) {
    this.alert = alert;
    this.dismissible = alert.classList.contains('alert-dismissible');

    this.render();
    this.react();
  }

  /**
   * 如果是可关闭的警告则添加一个关闭 icon
   * @return {Alert}
   */
  render() {
    if (this.dismissible) {
      const deleter = document.createElement('span');

      deleter.textContent = '×';
      deleter.classList.add('close');

      this.alert.appendChild(deleter);
      this.deleter = deleter;
    }

    return this;
  }

  /**
   * 若是可关闭的警告，点击关闭 icon，关闭该改警告
   * @return {Alert}
   */
  react() {
    if (this.dismissible) {
      this.deleter.addEventListener('click', () => { this.alert.remove(); });
    }

    return this;
  }
}

// Render all the alerts in the document
Array.from(document.querySelectorAll('.alert.alert-success')).forEach((alert) => {
  new Alert(alert);
});

Array.from(document.querySelectorAll('.alert.alert-info')).forEach((alert) => {
  new Alert(alert);
});

Array.from(document.querySelectorAll('.alert.alert-warning')).forEach((alert) => {
  new Alert(alert);
});

Array.from(document.querySelectorAll('.alert.alert-danger')).forEach((alert) => {
  new Alert(alert);
});
