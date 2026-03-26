# 浏览器自动化示例

使用 browser_use 工具进行网页自动化。

## 场景描述
- 自动登录网站
- 抓取网页数据
- 填写表单
- 截图保存

## 工具配置
```json
{
  "type": "builtin",
  "name": "browser_use",
  "config": {
    "headless": false,
    "userDataDir": "${global.root_dir}/chrome_data"
  }
}
```
## 操作示例
### 导航到网页
```json
{
  "action": "go_to_url",
  "url": "https://example.com"
}
```
### 点击元素
```json
{
  "action": "click_element",
  "selector": "#submit-button"
}
```
### 输入文本
```json
{
  "action": "input_text",
  "selector": "#username",
  "text": "my_username"
}
```
## 相关文档
- [browser_use 工具](/guide/tools/browser-use) - 详细配置
