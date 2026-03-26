# 本地开发

在本地环境搭建 TPCLAW 开发环境。

## 环境要求
- Go 1.24+
- Node.js 22+ (可选，用于前端)
- Git

## 快速开始
```bash
# 克隆仓库
git clone https://github.com/teambuf/tpclaw.git
cd tpclaw

# 安装依赖
go mod download

# 配置
cp configs/config.yaml.example configs/config.yaml

# 运行
go run cmd/server/main.go
```
## 开发模式
```bash
# 启用调试日志
export LOG_LEVEL=debug

# 运行开发服务器
go run cmd/server/main.go --mode=debug
```
## 热重载
修改智能体配置后自动重载：
```yaml
agents:
  autoReload: true
  reloadInterval: 5s
```
## 相关文档
- [安装指南](/guide/getting-started/installation) - 详细安装
- [配置文件](/guide/configuration/config-file) - 配置说明
