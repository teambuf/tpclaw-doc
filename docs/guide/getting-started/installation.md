# 安装指南

本文档介绍 TpClaw 的多种安装方式，您可以根据实际需求选择最适合的方式。

## 安装方式概览

| 方式 | 适用场景 | 难度 |
|------|----------|------|
| 二进制下载 | 生产环境、快速部署 | 简单 |
| 源码编译 | 开发调试、自定义构建 | 中等 |

---

## 方式一：二进制下载

这是最简单的安装方式，适合大多数用户。

### 1. 下载二进制文件

访问 [GitHub Releases](https://github.com/teambuf/tpclaw/releases) 页面，根据您的操作系统和架构下载对应的压缩包：

| 平台 | 架构 | 文件名 |
|------|------|--------|
| Windows | AMD64 | `tpclaw-v1.0.0-windows-amd64-embed.zip` |
| Linux | AMD64 | `tpclaw-1.0.0-linux-amd64-embed.tar.gz` |
| Linux | ARM64 | `tpclaw-1.0.0-linux-arm64-embed.tar.gz` |

### 2. Windows 部署

Windows 版本为绿色免安装版本，解压后即可运行。

**步骤：**

1. **解压文件**

   右键点击下载的 `tpclaw-v1.0.0-windows-amd64-embed.zip` 文件，选择"解压到当前文件夹"或使用解压软件解压。

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
   ├── workspace/           # 工作空间目录
   ├── logs/                # 日志目录
   └── chrome_data/         # Chrome 数据目录
   ```

3. **访问服务**

   服务启动后，访问 http://localhost:9527 验证服务是否正常运行。

### 3. Linux 部署

Linux 版本提供安装脚本，支持用户级和系统级两种安装方式。

**步骤：**

1. **解压文件**

   ```bash
   # AMD64
   tar -xzf tpclaw-1.0.0-linux-amd64-embed.tar.gz

   # ARM64
   tar -xzf tpclaw-1.0.0-linux-arm64-embed.tar.gz
   ```

2. **运行安装脚本**

   进入解压后的目录，运行安装脚本：

   ```bash
   cd tpclaw

   # 用户级安装（推荐，需要 sudo）
   sudo ./install.sh

   # 或指定端口
   sudo ./install.sh --port 8080

   # 如果没有 sudo 权限，使用 --user-bin 参数
   ./install.sh --user-bin

   # 系统级安装
   sudo ./install.sh --system
   ```

   安装参数说明：

   | 参数 | 说明 | 默认值 |
   |------|------|--------|
   | `--system` | 安装为系统级服务 | 否 |
   | `--port PORT` | 指定服务端口 | 9527 |
   | `--workdir DIR` | 指定工作目录 | `~/.tpclaw` |
   | `--user-bin` | 二进制安装到用户目录 | 否 |
   | `-h, --help` | 显示帮助信息 | - |

3. **服务管理**

   安装成功后，可以使用以下命令管理服务：

   ```bash
   # 通过 tpclaw 命令
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

4. **访问服务**

   服务启动后，访问 http://localhost:9527 验证服务是否正常运行。

### 4. 验证安装

```bash
tpclaw version
# 输出示例:
# TpClaw version: v1.0.0
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

## 方式四：包管理器安装

### Homebrew (macOS)

```bash
# 添加 tap
brew tap rulego/tap

# 安装
brew install tpclaw

# 更新
brew upgrade tpclaw
```

### Scoop (Windows)

```powershell
# 添加 bucket
scoop bucket add rulego https://github.com/rulego/scoop-bucket

# 安装
scoop install tpclaw
```

### APT (Debian/Ubuntu)

```bash
# 添加仓库
curl -fsSL https://apt.rulego.com/gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/rulego.gpg
echo "deb [signed-by=/usr/share/keyrings/rulego.gpg] https://apt.rulego.com stable main" | sudo tee /etc/apt/sources.list.d/rulego.list

# 更新并安装
sudo apt update
sudo apt install tpclaw
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
- **Linux**: `tpclaw service start`

访问 http://localhost:9527 验证服务是否正常运行。

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

### Q: Windows 下执行权限问题？

以管理员身份运行 PowerShell 或命令提示符。

## 下一步

安装完成后，请继续阅读：

- [快速入门](./quickstart.md) - 5 分钟快速上手
- [配置 API Key](./api-key.md) - 配置必要的 API 密钥
