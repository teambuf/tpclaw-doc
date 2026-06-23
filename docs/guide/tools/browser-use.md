# browser_use - 浏览器自动化工具

使用 Chrome/Chromium 进行网页导航、元素交互和内容提取。

::: warning 默认关闭
`browser_use` 工具默认是关闭的，需要手动启用。

**启用方式**：进入「智能体管理」→ 编辑智能体 → 「工具」标签页 → 勾选 `browser_use`

详见 [浏览器搜索教程](/guide/examples/browser-search)
:::

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
    "headless": true,
    "userDataDir": "${global.root_dir}/chrome_data",
    "timeout": 30,
    "searchEngine": "baidu"
  }
}
```

### 配置参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `headless` | bool | true | 无头模式（不显示浏览器窗口） |
| `userDataDir` | string | - | Chrome 用户数据目录，用于保留登录状态 |
| `timeout` | int | 30 | 操作超时时间（秒） |
| `chromeInstancePath` | string | - | Chrome 可执行文件路径 |
| `disableSecurity` | bool | false | 禁用安全特性（仅测试用） |
| `proxyServer` | string | - | 代理服务器地址 |
| `searchEngine` | string | `baidu` | 默认搜索引擎：google, baidu, bing, duckduckgo 或自定义 URL |
| `extraChromiumArgs` | []string | - | 额外的 Chromium 命令行参数 |
| `chromiumFlags` | map | - | Chromium 命令行参数（支持带值） |

## 操作类型

### go_to_url - 导航到 URL

```json
{
  "action": "go_to_url",
  "url": "https://example.com"
}
```

### click_element - 点击元素

通过元素索引点击（索引从页面元素列表中获取）：

```json
{
  "action": "click_element",
  "index": 0
}
```

### input_text - 输入文本

```json
{
  "action": "input_text",
  "index": 0,
  "text": "搜索关键词"
}
```

### scroll_down / scroll_up - 滚动页面

```json
{
  "action": "scroll_down",
  "scroll_amount": 500
}
```

### extract_content - 提取内容

使用 AI 提取页面内容：

```json
{
  "action": "extract_content",
  "goal": "获取页面主要内容"
}
```

### web_search - 网页搜索

使用配置的搜索引擎搜索：

```json
{
  "action": "web_search",
  "query": "搜索关键词"
}
```

### wait - 等待

```json
{
  "action": "wait",
  "seconds": 3
}
```

### open_tab / switch_tab / close_tab - 标签页管理

```json
{
  "action": "open_tab",
  "url": "https://example.com"
}
```

```json
{
  "action": "switch_tab",
  "tab_id": 0
}
```

```json
{
  "action": "close_tab",
  "tab_id": 0
}
```

### set_timeout - 设置超时

```json
{
  "action": "set_timeout",
  "timeout": 60
}
```

### set_search_engine - 设置搜索引擎

```json
{
  "action": "set_search_engine",
  "search_engine": "google"
}
```

### set_headless - 设置无头模式

```json
{
  "action": "set_headless",
  "headless": true
}
```

## 使用示例

### 搜索并获取结果

```json
// 1. 使用 web_search 搜索
{"action": "web_search", "query": "TPCLAW"}

// 2. 等待结果加载
{"action": "wait", "seconds": 2}

// 3. 提取搜索结果
{"action": "extract_content", "goal": "获取搜索结果列表"}
```

### 登录网站

```json
// 1. 打开登录页
{"action": "go_to_url", "url": "https://example.com/login"}

// 2. 输入用户名（假设用户名输入框是页面第 1 个可交互元素）
{"action": "input_text", "index": 0, "text": "user@example.com"}

// 3. 输入密码（假设密码输入框是第 2 个可交互元素）
{"action": "input_text", "index": 1, "text": "password123"}

// 4. 点击登录按钮（假设登录按钮是第 3 个可交互元素）
{"action": "click_element", "index": 2}
```

### 提取页面内容

```json
// 1. 打开网页
{"action": "go_to_url", "url": "https://example.com/article"}

// 2. 等待页面加载
{"action": "wait", "seconds": 3}

// 3. 提取文章内容
{"action": "extract_content", "goal": "提取文章标题和正文内容"}
```

## 元素定位

browser_use 工具使用**索引**定位页面元素，而非 CSS 选择器。页面加载后会自动解析所有可交互元素并分配索引。

### 获取元素索引

调用 `go_to_url` 或执行操作后，返回结果会包含当前页面的元素列表和索引。

### 最佳实践

#### 1. 添加等待时间

网络操作需要等待：

```json
{"action": "go_to_url", "url": "..."}
{"action": "wait", "seconds": 3}
```

#### 2. 使用持久化会话

配置 `userDataDir` 保持登录状态：

```json
{
  "config": {
    "userDataDir": "${global.root_dir}/chrome_data"
  }
}
```

#### 3. 使用 web_search 搜索

直接使用内置搜索功能，无需手动操作搜索框：

```json
{"action": "web_search", "query": "要搜索的内容"}
```

## 注意事项

- 确保已安装 Chrome 或 Chromium
- 首次运行会自动下载 ChromeDriver
- 复杂网站可能需要调整等待时间
- 某些网站有反爬虫机制

## 相关文档

- [bash](/guide/tools/bash) - 执行命令
- [read](/guide/tools/read) - 读取文件
