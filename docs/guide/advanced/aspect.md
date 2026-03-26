# 切面编程

TPCLAW 支持切面编程 (AOP)，用于添加横切关注点。

## 切面类型
| 切面 | 说明 |
|------|------|
| 日志切面 | 记录操作日志 |
| 状态追踪 | 追踪智能体状态 |
| 性能监控 | 监控执行性能 |

## 配置切面
```yaml
aspects:
  logging:
    enabled: true
    level: info
  status_tracker:
    enabled: true
```
## 自定义切面
实现 Aspect 接口：
```go
type Aspect interface {
    Before(ctx context.Context, point Point) error
    After(ctx context.Context, point Point, result interface{}) error
}
```
## 相关文档
- [架构概览](/guide/introduction/architecture) - 系统架构
