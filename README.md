# 地毯AI销售教练网页 V1

这是一个可登录的网页原型，给员工使用。

## 本地打开

1. 打开 PowerShell。
2. 进入这个文件夹：

```powershell
cd C:\Users\Fa\Documents\Codex\2026-06-01\ai-ai\outputs\carpet-ai-coach
```

3. 启动：

```powershell
& C:\Users\Fa\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe server.js
```

4. 浏览器打开：

```text
http://localhost:8787
```

## 默认测试账号

```text
admin / admin123
sales / sales123
```

正式给员工使用前，一定要改密码。

## 接入真正 AI：DeepSeek

如果设置了 `DEEPSEEK_API_KEY`，系统会调用 DeepSeek 生成更灵活的回复。
如果没有设置，它会使用本地演示规则生成固定结构回复。

PowerShell 示例：

```powershell
$env:DEEPSEEK_API_KEY="你的 DeepSeek API Key"
$env:AI_PROVIDER="deepseek"
$env:DEEPSEEK_MODEL="deepseek-v4-flash"
$env:SESSION_SECRET="一串很长的随机字符"
& C:\Users\Fa\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe server.js
```

也可以把 `DEEPSEEK_MODEL` 改成 `deepseek-v4-pro`，但测试阶段建议先用 `deepseek-v4-flash`。

## 员工账号配置

可以用 `USERS_JSON` 配置员工账号：

```powershell
$env:USERS_JSON='[{"username":"alice","password":"alice123","name":"Alice"},{"username":"bob","password":"bob123","name":"Bob"}]'
```

## 上云部署

这个版本可以部署到 Render、Railway、Vercel Serverless 以外的 Node 服务器、阿里云、腾讯云或你自己的 VPS。

上云需要准备：

- 域名，例如 `coach.yourdomain.com`
- OpenAI API Key
- 员工账号列表
- SESSION_SECRET
- 云服务器或托管平台账号

## V1 功能

- 账号密码登录
- 员工输入客户原话
- AI 判断客户类型
- 输出中英文销售回复
- 推荐产品方向
- 给出追问问题和下一步动作
- 范围价格原则：不承诺最终报价，最终价格交给工厂确认
