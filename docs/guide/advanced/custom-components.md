# 自定义组件

开发自定义组件扩展 TPCLAW 功能。

## 组件类型
| 类型 | 说明 |
|------|------|
| 自定义节点 | 规则链节点 |
| 自定义工具 | 智能体工具 |
| 自定义通道 | IM 通道 |

## 开发自定义节点
```go
package mynode

import "github.com/rulego/rulego/api/types"

type MyNode struct {
    Config MyNodeConfig
}

func (n *MyNode) OnMsg(ctx types.RuleContext, msg types.RuleMsg) {
    // 处理消息
    ctx.TellSuccess(msg)
}
```
## 开发自定义工具
```go
package mytool

type MyTool struct{}

func (t *MyTool) Info() ToolInfo {
    return ToolInfo{
        Name: "my_tool",
        Description: "自定义工具",
    }
}

func (t *MyTool) Execute(ctx context.Context, params map[string]interface{}) (*ToolResult, error) {
    // 执行工具
    return &ToolResult{Success: true}, nil
}
```
## 注册组件
```go
func init() {
    // 注册节点
    rulego.Register("my/node", &MyNode{})

    // 注册工具
    toolManager.Register("my_tool", &MyTool{})
}
```
## 相关文档
- [工具概述](/guide/tools/) - 工具详细配置
- [智能体](/guide/core-features/agents) - 智能体配置
