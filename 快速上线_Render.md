# 不买域名，快速生成固定网址

推荐用 Render。它会自动给你一个网址，例如：

```text
https://carpet-ai-sales-kb.onrender.com
```

## 你需要准备

```text
1. DeepSeek API Key
2. 员工账号和密码
3. 一个 Render 账号
```

Render 官网：

```text
https://render.com
```

## 最简单上线流程

1. 把 `carpet-ai-coach` 这个文件夹上传到 GitHub。
2. 登录 Render。
3. 点 `New +`。
4. 选择 `Blueprint`。
5. 连接这个 GitHub 仓库。
6. Render 会读取 `render.yaml` 并创建网站。
7. 在环境变量里填：

```text
DEEPSEEK_API_KEY=你的 DeepSeek API Key
USERS_JSON=[{"username":"admin","password":"你的管理员密码","name":"Admin"},{"username":"sales01","password":"员工密码","name":"Sales 01"}]
```

8. 部署完成后，Render 会给你一个固定网址。

## 员工怎么用

员工打开 Render 给的网址，输入账号密码登录。

正式部署后，员工不需要输入 DeepSeek Key。DeepSeek Key 放在服务器环境变量里，员工看不到。

## 注意

- 免费版 Render 可能会休眠，第一次打开会慢一点。
- 先测试没问题，后续再换付费版或阿里云。
- 默认账号 `admin/admin123` 必须改掉。
