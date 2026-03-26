# 监控告警

配置 TPCLAW 的监控和告警系统。

## 健康检查
```bash
# HTTP 健康检查
GET /health

# 返回
{"status": "ok", "version": "2.0.0"}
```
## 指标收集
```yaml
monitoring:
  enabled: true
  metrics:
    - request_count
    - response_time
    - error_count
    - active_sessions
```
## 日志配置
```yaml
logger:
  level: info
  format: json
  output: stdout
```
## 告警规则
| 指标 | 阈值 | 说明 |
|------|------|------|
| 错误率 | > 5% | 错误比例过高 |
| 响应时间 | > 5s | 响应过慢 |
| 内存使用 | > 80% | 内存不足 |

## 相关文档
- [生产部署](/guide/deployment/production) - 生产环境配置
- [日志配置](/guide/configuration/config-file#logger) - 日志设置
