# 快速入门

3 步开始使用 TpClaw：**下载运行 → 配置 API Key → 对话**。

## 第一步：下载并启动

### Windows（推荐）

1. 下载 [tpclaw-v1.0.7-windows-amd64-embed.zip](https://gitee.com/rulego/tpclaw/releases/download/v1.0.7/tpclaw-v1.0.7-windows-amd64-embed.zip)
2. 右键解压到任意目录
3. 双击 `tpclaw.exe` 启动
4. 浏览器打开 `http://localhost:9527`，使用默认密码 `admin!@#` 登录

> 无需安装任何依赖，解压即用。Windows 可能弹出防火墙提示，选择「允许访问」。

### Linux

```bash
# 下载并解压（以 AMD64 为例）
wget https://gitee.com/rulego/tpclaw/releases/download/v1.0.7/tpclaw-v1.0.7-linux-amd64-embed.tar.gz
tar -xzf tpclaw-v1.0.7-linux-amd64-embed.tar.gz
cd tpclaw

# 一键安装并启动
sudo ./install.sh

# 验证
tpclaw version
```

> 其他平台和详细安装选项请参考 [安装指南](./installation.md)。

---

## 第二步：登录并配置 API Key

### 2.1 登录

浏览器访问 `http://localhost:9527`，输入密码 `admin!@#`，点击「立即登录」。

![登录页面](/img/quickstart/0.登录输入密码.png)

> 默认密码为 `admin!@#`，可在 [安全配置](/guide/configuration/security) 中修改。

### 2.2 配置 API Key

1. 点击左侧菜单「设置」→「大模型配置」标签页

![前往配置大模型KEY](/img/quickstart/1.前往配置大模型KEY.png)

2. 找到默认的「阿里云百炼 Coding」供应商卡片，点击编辑按钮（铅笔图标），填入 API Key

![配置apiKey](/img/quickstart/2.默认是阿里云百炼供应商-配置apiKey.png)

> 没有 API Key？[阿里云百炼](https://bailian.console.aliyun.com/) 注册即可免费获取。

> 如果对话时提示模型鉴权失败，也可以点击错误信息中的「前往配置」按钮直接跳转到这里。

---

## 第三步：开始对话

点击左侧菜单「对话」，在输入框输入消息，按 Enter 发送。

![聊天](/img/quickstart/5.聊天.png)

试试看：

> 你好，介绍一下你自己

恭喜，你已经可以和智能体对话了！

---

## 常用功能

### 切换智能体

在会话列表顶部点击当前智能体名称，可切换到其他智能体。

![切换智能体](/img/quickstart/7.切换智能体.png)

### 编辑智能体

点击左侧菜单「智能体」，可以编辑提示词、工具、工作空间等。

![智能体配置](/img/quickstart/6.智能体配置.png)

> 也可以在对话页面顶部点击「智能体配置」按钮快速跳转。

---

## 可选配置

### 使用其他大模型供应商

如需使用 OpenAI、智谱 AI 等，点击「大模型配置」右上角「+ 添加供应商」：

![添加自定义大模型供应商](/img/quickstart/3.添加自定义大模型供应商.png)

填写供应商信息（选择预设供应商会自动填充 Base URL），然后点击星标设为默认。

![设置默认供应商](/img/quickstart/4.点击设置成默认.png)

> 详细配置请参考 [大模型配置](/guide/configuration/models)。

### 接入飞书/企业微信

配置 IM 通道后，可以在飞书或企业微信中直接与智能体对话：

- **飞书**：设置 → 通道配置 → 飞书通道 → 扫码绑定，无需公网 IP。详见 [飞书通道](/guide/channels/feishu)
- **企业微信**：创建智能机器人 → 填入 Bot ID 和 Secret。详见 [企业微信通道](/guide/channels/wecom)

---

## 进阶玩法

| 功能 | 示例 | 文档 |
|------|------|------|
| 分析项目代码 | 把项目路径发给智能体，自动生成分析报告 | [示例：分析项目代码](/guide/examples/code-analysis) |
| 浏览器搜索 | 智能体添加 `browser_use` 工具后可搜索网络 | [示例：浏览器搜索](/guide/examples/browser-search) |
| 定时任务 + 推送 | 用自然语言设置定时任务，结果推送到飞书 | [定时任务](/guide/tools/cron-task) |
| 技能扩展 | 兼容 OpenClaw、Claude Code 等技能格式 | [技能管理](/guide/tools/skill) |

## 获取帮助

- Gitee Issues: https://gitee.com/rulego/tpclaw/issues
