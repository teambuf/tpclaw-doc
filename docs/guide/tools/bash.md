# bash - Shell 命令执行工具

执行 Shell 命令并与系统交互。

## 概述

`bash` 工具让智能体能够：
- 执行系统命令
- 管理文件和目录
- 运行脚本
- 与外部程序交互

## 配置

```json
{
  "type": "builtin",
  "name": "bash",
  "description": "执行 Shell 命令",
  "config": {
    "mode": "deny",
    "timeout": 60,
    "workDir": "${global.root_dir}/workspace"
  }
}
```

### 配置参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `workDir` | string | - | 工作目录 |
| `timeout` | int | 60 | 命令超时时间（秒） |
| `mode` | string | deny | 权限模式：allow/deny |
| `allowList` | []string | - | 允许的命令列表（mode=allow 时） |
| `denyList` | []string | - | 禁止的命令列表（mode=deny 时） |

## 权限模式

### deny 模式（默认）

禁止列表中的命令，其他命令允许执行：

```json
{
  "config": {
    "mode": "deny",
    "denyList": ["rm", "sudo", "chmod", "chown", "mkfs", "dd"]
  }
}
```

### allow 模式

只允许列表中的命令执行：

```json
{
  "config": {
    "mode": "allow",
    "allowList": ["ls", "cat", "grep", "find", "git", "go", "npm"]
  }
}
```

## 执行命令

### 基本用法

```json
{
  "command": "ls -la"
}
```

### 返回结果

```json
{
  "success": true,
  "stdout": "total 8\ndrwxr-xr-x 2 user user 4096 ...",
  "stderr": "",
  "exitCode": 0
}
```

## 使用示例

### 文件操作

```bash
# 列出目录
ls -la workspace/

# 查找文件
find . -name "*.go" -type f

# 查看文件内容
cat README.md

# 统计行数
wc -l main.go
```

### Git 操作

```bash
# 查看状态
git status

# 查看差异
git diff

# 查看日志
git log --oneline -10
```

### 开发工具

```bash
# Go 编译
go build -o app main.go

# 运行测试
go test ./...

# 安装依赖
npm install
```

### 网络操作

```bash
# 下载文件
curl -O https://example.com/file.zip

# HTTP 请求
curl -X GET https://api.example.com/data
```

## 跨平台支持

TPCLAW 自动适配不同操作系统：

### Windows 适配

在 Windows 上，命令会自动转换为对应的 PowerShell/CMD 命令：

```bash
# Unix 命令
ls -la

# Windows 上自动转换为
dir /a
```

### 推荐使用跨平台命令

| 推荐 | 避免 |
|------|------|
| `ls` | `dir` (Windows only) |
| `cat` | `type` (Windows only) |
| `rm` | `del` (Windows only) |
| `cp` | `copy` (Windows only) |
| `mv` | `move` (Windows only) |

## 安全限制

### 命令白名单/黑名单

```json
{
  "config": {
    "mode": "deny",
    "denyList": [
      "rm -rf /",
      "sudo",
      "chmod 777",
      "> /dev/sda",
      "mkfs"
    ]
  }
}
```

### 超时保护

命令执行超过 `timeout` 秒后自动终止：

```json
{
  "config": {
    "timeout": 60
  }
}
```

### 输出截断

输出超过 65536 字节会被截断。

## 环境变量

可以在配置中设置环境变量：

```json
{
  "config": {
    "env": {
      "PATH": "/usr/local/bin:/usr/bin",
      "HOME": "/home/user",
      "GOPATH": "/go"
    }
  }
}
```

## 错误处理

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `command not found` | 命令不存在 | 检查命令拼写或安装对应工具 |
| `permission denied` | 权限不足 | 检查用户权限或命令黑名单 |
| `timeout` | 命令执行超时 | 增加 timeout 或优化命令 |
| `command blocked` | 命令被阻止 | 检查黑白名单配置 |

## 最佳实践

### 1. 使用工作目录

始终在配置的工作目录中执行命令：

```json
{
  "command": "ls -la",
  "config": {
    "workDir": "/workspace"
  }
}
```

### 2. 设置合理的超时

根据命令类型设置合理的超时时间：

```json
{
  "config": {
    "timeout": 300  // 长时间任务
  }
}
```

### 3. 组合命令使用 &&

使用 `&&` 组合多个命令，确保顺序执行：

```bash
# 先切换目录再执行
cd workspace && go build && go test
```

### 4. 错误处理

检查命令返回值和 stderr：

```bash
# 使用 || 处理错误
command || echo "Command failed"

# 使用 set -e 在脚本中
set -e && command1 && command2
```

## 危险命令警告

以下命令应谨慎使用或禁止：

| 命令 | 风险 |
|------|------|
| `rm -rf /` | 删除整个系统 |
| `sudo` | 提权操作 |
| `chmod 777` | 不安全的权限设置 |
| `dd` | 磁盘操作 |
| `mkfs` | 格式化磁盘 |
| `:(){ :|:& };:` | Fork 炸弹 |

## 相关工具

- [read](/guide/tools/read) - 文件读取
- [write](/guide/tools/write) - 文件写入
- [edit](/guide/tools/edit) - 文件编辑
