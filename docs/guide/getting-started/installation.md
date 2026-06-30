# 安装指南

本文档介绍 TpClaw 的安装方式。

## 安装方式概览

| 方式 | 适用场景 | 难度 |
|------|----------|------|
| [二进制下载](#方式一-二进制下载) | 生产环境、快速部署 | 简单 |
| [源码编译](#方式二-源码编译) | 开发调试、自定义构建 | 中等 |

---

## 方式一：二进制下载

这是最简单的安装方式，适合大多数用户。

### 1. 下载二进制文件

根据您的操作系统和架构下载对应的压缩包：

| 平台 | 架构 | 下载 |
|------|------|------|
| Windows | AMD64 | [tpclaw-v1.1.0-windows-amd64-embed.zip](https://gitee.com/rulego/tpclaw/releases/download/v1.1.0/tpclaw-v1.1.0-windows-amd64-embed.zip) |
| Linux | AMD64 | [tpclaw-v1.1.0-linux-amd64-embed.tar.gz](https://gitee.com/rulego/tpclaw/releases/download/v1.1.0/tpclaw-v1.1.0-linux-amd64-embed.tar.gz) |
| Linux | ARM64 | [tpclaw-v1.1.0-linux-arm64-embed.tar.gz](https://gitee.com/rulego/tpclaw/releases/download/v1.1.0/tpclaw-v1.1.0-linux-arm64-embed.tar.gz) |
| macOS | ARM64 | [tpclaw-v1.1.0-darwin-arm64-embed.tar.gz](https://gitee.com/rulego/tpclaw/releases/download/v1.1.0/tpclaw-v1.1.0-darwin-arm64-embed.tar.gz) |
| macOS | AMD64 | [tpclaw-v1.1.0-darwin-amd64-embed.tar.gz](https://gitee.com/rulego/tpclaw/releases/download/v1.1.0/tpclaw-v1.1.0-darwin-amd64-embed.tar.gz) |

> 更多历史版本请访问 [GitHub Releases](https://github.com/teambuf/tpclaw/releases) 页面。

### 2. Windows 部署

Windows 版本为绿色免安装版本，解压后即可运行。

**步骤：**

1. **解压文件**

   右键点击下载的 `tpclaw-v1.1.0-windows-amd64-embed.zip` 文件，选择"解压到当前文件夹"或使用解压软件解压。

2. **运行程序**

   进入解压后的目录，双击 `tpclaw.exe` 即可启动服务。

   解压后的目录结构：
   ```
   tpclaw/
   ├── tpclaw.exe           # 主程序（双击运行）
   ├── config.yaml          # 配置文件
   ├── config.yaml.example  # 配置文件示例
   ├── agents/              # 智能体配置目录
   ├── skills/              # 技能目录
   ├── workspace/           # 主智能体工作空间目录
   └── logs/                # 日志目录（运行后自动创建）
   ```

3. **访问服务**

   服务启动后，访问 `http://localhost:9527` 验证服务是否正常运行。

### 3. Linux 部署

Linux 版本提供安装脚本，支持用户级和系统级两种安装方式。

**步骤：**

1. **解压文件**

   ```bash
   # AMD64
   tar -xzf tpclaw-v1.1.0-linux-amd64-embed.tar.gz

   # ARM64
   tar -xzf tpclaw-v1.1.0-linux-arm64-embed.tar.gz
   ```

2. **运行安装脚本**

   进入解压后的目录，运行安装脚本：

   ```bash
   cd tpclaw

   # 用户级安装（推荐）
   # 二进制安装到 /usr/local/bin，数据在 ~/.tpclaw（用户隔离）
   sudo ./install.sh

   # 没有 sudo 权限时，使用 --user-bin 安装到用户目录
   ./install.sh --user-bin

   # 系统级安装（所有资源在系统目录）
   sudo ./install.sh --system
   ```

   **常用安装命令：**

   ```bash
   # 用户级安装（推荐，二进制全局，数据用户隔离）
   sudo ./install.sh

   # 没有 sudo 权限
   ./install.sh --user-bin

   # 系统级安装
   sudo ./install.sh --system
   ```

   安装参数说明（更多参数请运行 `./install.sh --help`）：

   | 参数 | 说明 | 默认值 |
   |------|------|--------|
   | `--system` | 安装为系统级服务 | 否 |
   | `--port PORT` | 指定服务端口 | `9527` |
   | `--workdir DIR` | 指定工作目录 | `~/.tpclaw` |
   | `--config FILE` | 指定配置文件路径 | 自动生成 |
   | `--user-bin` | 二进制安装到用户目录 `~/.local/bin`（无需 sudo） | 否 |

   > 安装脚本会自动完成：复制二进制 → 复制 skills → 安装 plugins → 生成配置 → 创建 systemd 服务 → 启动服务。

3. **服务管理**

   安装成功后，可以使用以下命令管理服务：

   ```bash
   # 通过 tpclaw 命令（推荐）
   tpclaw service status   # 查看状态
   tpclaw service start    # 启动服务
   tpclaw service stop     # 停止服务
   tpclaw service restart  # 重启服务

   # 或通过 systemctl（用户级）
   systemctl --user status tpclaw
   systemctl --user start tpclaw
   systemctl --user stop tpclaw

   # 或通过 systemctl（系统级）
   sudo systemctl status tpclaw
   sudo systemctl start tpclaw
   sudo systemctl stop tpclaw
   ```

   > **提示**：如果 `systemctl --user` 不可用（常见于 SSH 环境），脚本会提示手动启动方式。也可以直接运行 `tpclaw start` 前台启动。

4. **访问服务**

   服务启动后，访问 `http://localhost:9527` 验证服务是否正常运行。

### 4. 验证安装

```bash
tpclaw version
# 输出示例:
# TpClaw version: v1.1.0
# Go version: go1.24.0
# OS/Arch: linux/amd64
```

---

## 方式二：源码编译

适合开发者进行定制化构建或参与项目开发。

### 1. 环境准备

确保已安装以下工具：

- Go 1.24+
- Git
- Make（可选）

```bash
# 验证 Go 版本
go version
# 输出: go version go1.24.0 linux/amd64
```

### 2. 克隆代码仓库

```bash
# 克隆主仓库
git clone https://github.com/teambuf/tpclaw.git

# 进入项目目录
cd tpclaw
```

### 3. 编译项目

**使用 Make（推荐）:**

```bash
# 编译当前平台版本
make build

# 编译所有平台版本
make build-all

# 查看 Makefile 可用命令
make help
```

**手动编译:**

```bash
# 下载依赖
go mod download

# 编译
go build -o tpclaw ./cmd/tpclaw

# 或指定版本信息
VERSION=$(git describe --tags --always)
BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

go build -ldflags="-s -w -X main.Version=$VERSION -X main.BuildTime=$BUILD_TIME" \
  -o tpclaw ./cmd/tpclaw
```

**交叉编译:**

```bash
# Linux AMD64
GOOS=linux GOARCH=amd64 go build -o tpclaw-linux-amd64 ./cmd/tpclaw

# Linux ARM64
GOOS=linux GOARCH=arm64 go build -o tpclaw-linux-arm64 ./cmd/tpclaw

# macOS AMD64
GOOS=darwin GOARCH=amd64 go build -o tpclaw-darwin-amd64 ./cmd/tpclaw

# macOS ARM64
GOOS=darwin GOARCH=arm64 go build -o tpclaw-darwin-arm64 ./cmd/tpclaw

# Windows AMD64
GOOS=windows GOARCH=amd64 go build -o tpclaw-windows-amd64.exe ./cmd/tpclaw
```

### 4. 运行测试

```bash
# 运行所有测试
make test

# 或
go test ./... -v

# 运行测试并生成覆盖率报告
go test ./... -coverprofile=coverage.out
go tool cover -html=coverage.out
```

### 5. 安装到系统

```bash
# 安装到 GOPATH/bin
go install ./cmd/tpclaw

# 或手动复制
sudo cp tpclaw /usr/local/bin/
```

---

## 安装验证

无论使用哪种安装方式，完成后请验证安装是否成功：

```bash
# 查看版本
tpclaw version

# 查看帮助
tpclaw --help
```

**启动服务：**

- **Windows**: 双击 `tpclaw.exe` 启动
- **Linux**: `tpclaw start` 或 `tpclaw service start`

访问 `http://localhost:9527` 验证服务是否正常运行。

## 升级

### Linux 升级

下载新版本后，替换二进制文件并重启服务即可，数据和工作空间无需迁移。

**用户级安装升级：**

```bash
# 1. 解压新版本
tar -xzf tpclaw-1.x.x-linux-amd64-embed.tar.gz
cd tpclaw

# 2. 替换二进制文件
sudo cp tpclaw /usr/local/bin/tpclaw

# 3. 重启服务
tpclaw service restart

# 4. 验证版本
tpclaw version
```

**系统级安装升级：**

```bash
# 同上，替换二进制后重启
sudo cp tpclaw /usr/local/bin/tpclaw
sudo systemctl restart tpclaw
```

> 升级只会替换二进制文件，不会影响 `~/.tpclaw/` 下的配置、智能体、会话和技能数据。

### Windows 升级

下载新版本解压后，将 `tpclaw.exe` 复制到旧版本目录覆盖即可（建议先备份 `config.yaml`）。

## 常见问题

### Q: 编译时提示 Go 版本不兼容？

确保 Go 版本 >= 1.24：

```bash
go version
# 如果版本过低，请升级 Go
```

### Q: 端口被占用？

检查端口是否被占用：

```bash
# Linux/macOS
lsof -i :9527

# Windows
netstat -ano | findstr :9527
```

### Q: Linux 安装后 systemctl --user 不可用？

这通常发生在 SSH 会话中。解决办法：

```bash
# 启用 lingering（开机自动启动用户服务）
sudo loginctl enable-linger $USER

# 重新登录 SSH 后执行
systemctl --user enable --now tpclaw
```

或者直接前台运行：`tpclaw start`

### Q: 没有 sudo 权限怎么安装？

使用 `--user-bin` 参数，二进制文件安装到用户目录，无需 sudo：

```bash
./install.sh --user-bin
```

## 下一步

安装完成后，请继续阅读：

- [快速入门](./quickstart.md) - 5 分钟快速上手
- [配置 API Key](./api-key.md) - 配置必要的 API 密钥
