# 练习三

模仿微信带字数限制的输入框

## 需求

- 请使用原生 js（vanilla js）
- 输入框右侧实时显示字数提示：已输入字数 / 字数上限
- 文字过长仍然能输入，注意字数提示不能被文字遮盖
- 若输入为空且该字段必填，或超出上限则输入框下方显示红色错误信息，错误信息可定制化。初始化为空时，不显示该错误信息
- markup `<input type="text" counter-input counter-input-max="21" counter-input-exceeding-warning="请正确输入视频标题" required>`
