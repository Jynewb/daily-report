# 🤖 AI Daily Report

每日自动生成的AI热点日报，发布到GitHub Pages。

## 功能

- ⏰ 每天8:00自动运行（GitHub Actions Cron）
- 🔍 自动收集AI领域热点资讯
- 🤖 AI自动总结要点
- 🌐 生成静态网站并发布到GitHub Pages

## 快速开始

### 1. Fork本仓库

点击右上角"Fork"复制到你自己的GitHub账户。

### 2. 配置Secrets

在仓库设置中添加以下Secrets：

| Secret | 说明 | 获取方式 |
|--------|------|----------|
| `TAVILY_API_KEY` | 搜索API | [tavily.com](https://tavily.com) 注册免费获取 |
| `MINIMAX_API_KEY` | AI总结API | [MiniMax](https://platform.minimax.chat) 注册获取 |

### 3. 启用GitHub Pages

1. 进入仓库 Settings → Pages
2. Source 选择 "Deploy from a branch"
3. Branch 选择 "gh-pages" (首次运行后出现)

### 4. 手动触发

进入 Actions → "Daily AI Report" → "Run workflow"

## 本地运行

```bash
# 安装依赖
npm install

# 设置环境变量
export TAVILY_API_KEY=your_key
export MINIMAX_API_KEY=your_key

# 运行
npm start
```

## 配置

修改 `config.js` 自定义：

- 搜索关键词
- 信息源
- AI模型参数
- 输出目录

## 输出示例

访问 `https://你的用户名.github.io/daily-report/`

## License

MIT
