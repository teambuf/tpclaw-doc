# browser_use - 浏览器自动化工具

使用 Chrome/Chromium 进行网页导航、元素交互和内容提取。

## 概述

`browser_use` 工具让智能体能够：
- 打开和导航网页
- 点击元素和填写表单
- 提取页面内容
- 截图和保存页面
- 管理多个标签页

## 配置

```json
{
  "type": "builtin",
  "name": "browser_use",
  "description": "浏览器自动化工具",
  "config": {
    "headless": false,
    "userDataDir": "${global.root_dir}/chrome_data",
    "timeout": 30
  }
}
```

### 配置参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `headless` | bool | false | 无头模式（不显示浏览器窗口） |
| `userDataDir` | string | - | Chrome 用户数据目录 |
| `timeout` | int | 30 | 操作超时时间（秒） |
| `chromeInstancePath` | string | - | Chrome 可执行文件路径 |
| `disableSecurity` | bool | false | 禁用安全特性（仅测试用） |
| `proxyServer` | string | - | 代理服务器地址 |

## 操作类型

### go_to_url - 导航到 URL

```json
{
  "operation": "go_to_url",
  "url": "https://example.com"
}
```

### click_element - 点击元素

```json
{
  "operation": "click_element",
  "selector": "#submit-button"
}
```

### input_text - 输入文本

```json
{
  "operation": "input_text",
  "selector": "#search-input",
  "text": "搜索关键词"
}
```

### scroll_down / scroll_up - 滚动页面

```json
{
  "operation": "scroll_down",
  "amount": 500
}
```

### extract_content - 提取内容

```json
{
  "operation": "extract_content",
  "selector": ".article-content"
}
```

### wait - 等待

```json
{
  "operation": "wait",
  "duration": 2000
}
```

### screenshot - 截图

```json
{
  "operation": "screenshot",
  "path": "screenshot.png"
}
```

### open_tab / switch_tab / close_tab - 标签页管理

```json
{
  "operation": "open_tab",
  "url": "https://example.com"
}
```

## 使用示例

### 搜索并获取结果

```json
// 1. 打开搜索引擎
{"operation": "go_to_url", "url": "https://www.google.com"}

// 2. 输入搜索词
{"operation": "input_text", "selector": "input[name='q']", "text": "TPCLAW"}

// 3. 点击搜索
{"operation": "click_element", "selector": "input[type='submit']"}

// 4. 等待结果加载
{"operation": "wait", "duration": 2000}

// 5. 提取搜索结果
{"operation": "extract_content", "selector": "#search-results"}
```

### 登录网站

```json
// 1. 打开登录页
{"operation": "go_to_url", "url": "https://example.com/login"}

// 2. 输入用户名
{"operation": "input_text", "selector": "#username", "text": "user@example.com"}

// 3. 输入密码
{"operation": "input_text", "selector": "#password", "text": "password123"}

// 4. 点击登录
{"operation": "click_element", "selector": "#login-button"}
```

## 选择器语法

支持 CSS 选择器和 XPath：

| 类型 | 示例 |
|------|------|
| ID | `#element-id` |
| Class | `.class-name` |
| 属性 | `[name="value"]` |
| XPath | `//div[@class="content"]` |
| 文本 | `//button[contains(text(), "提交")]` |

## 最佳实践

### 1. 添加等待时间

网络操作需要等待：

```json
{"operation": "go_to_url", "url": "..."}
{"operation": "wait", "duration": 2000}
```

### 2. 使用持久化会话

配置 `userDataDir` 保持登录状态：

```json
{
  "config": {
    "userDataDir": "${global.root_dir}/chrome_data"
  }
}
```

### 3. 处理动态内容

等待元素出现后再操作：

```json
{"operation": "wait", "selector": ".loaded-content", "timeout": 5000}
```

## 注意事项

- 确保已安装 Chrome 或 Chromium
- 首次运行会自动下载 ChromeDriver
- 复杂网站可能需要调整等待时间
- 某些网站有反爬虫机制

## 相关工具

- [bash](/guide/tools/bash) - 执行命令
- [read](/guide/tools/read) - 读取文件
