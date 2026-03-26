# 自动化任务示例

配置智能体自动执行定时任务。

## 场景描述
- 定时检查系统状态
- 自动生成报告
- 定期清理过期数据

## 心跳配置
```yaml
agents:
  heartbeat:
    enabled: true
    interval: "1h"
    tasks:
      - name: "check_health"
        schedule: "0 */1 * * *"
      - name: "generate_report"
        schedule: "0 9 * * 1"
```
## 心跳任务文件
```markdown
# HEARTBEAT.md

## 每小时任务
- 检查系统健康状态
- 清理过期会话

## 每日任务
- 生成使用报告
- 备份重要数据
```
## 相关文档
- [记忆系统](/guide/core-features/memory) - 记忆配置
- [工作空间](/guide/workspace/structure) - 工作空间结构
