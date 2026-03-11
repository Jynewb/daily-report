const fs = require('fs');
const path = require('path');

// 日报模板
const template = (data) => `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Daily Report - ${data.date}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      min-height: 100vh;
      color: #e4e4e7;
      padding: 40px 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    header {
      text-align: center;
      margin-bottom: 40px;
    }
    h1 {
      font-size: 2.5em;
      background: linear-gradient(90deg, #00d2ff, #3a7bd5);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }
    .date {
      color: #6b7280;
      font-size: 0.9em;
    }
    .section {
      background: rgba(255,255,255,0.05);
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 24px;
      border: 1px solid rgba(255,255,255,0.1);
    }
    h2 {
      font-size: 1.3em;
      margin-bottom: 20px;
      color: #00d2ff;
    }
    .news-list {
      list-style: none;
    }
    .news-item {
      padding: 16px 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .news-item:last-child { border-bottom: none; }
    .news-title {
      font-size: 1.1em;
      color: #fff;
      text-decoration: none;
      display: block;
      margin-bottom: 8px;
      transition: color 0.2s;
    }
    .news-title:hover { color: #00d2ff; }
    .news-meta {
      font-size: 0.85em;
      color: #6b7280;
    }
    .news-meta span {
      margin-right: 16px;
    }
    .summary {
      line-height: 1.8;
      white-space: pre-wrap;
    }
    .highlight {
      background: linear-gradient(90deg, #00d2ff20, #3a7bd520);
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
    }
    .highlight h3 {
      color: #00d2ff;
      margin-bottom: 12px;
      font-size: 1em;
    }
    footer {
      text-align: center;
      color: #4b5563;
      font-size: 0.85em;
      margin-top: 40px;
    }
    .tag {
      display: inline-block;
      background: rgba(0,210,255,0.2);
      color: #00d2ff;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8em;
      margin-right: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🤖 AI Daily Report</h1>
      <p class="date">${data.date} | ${data.time}</p>
    </header>

    <section class="section">
      <h2>📊 热点摘要</h2>
      <div class="highlight">
        <h3>今日焦点</h3>
        <div class="summary">${data.summary}</div>
      </div>
    </section>

    <section class="section">
      <h2>🔥 热门资讯</h2>
      <ul class="news-list">
        ${data.news.map(item => `
          <li class="news-item">
            <a href="${item.url}" target="_blank" class="news-title">${item.title}</a>
            <div class="news-meta">
              <span>📰 ${item.source}</span>
            </div>
          </li>
        `).join('')}
      </ul>
    </section>

    <section class="section">
      <h2>🏷️ 趋势标签</h2>
      <div>
        ${data.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
    </section>

    <footer>
      <p>🤖 由 AI 自动生成 | 数据来源: Tavily Search</p>
    </footer>
  </div>
</body>
</html>
`;

// 生成网站
function generate(data, config) {
  const date = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  const time = new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // 提取标签
  const tags = [...new Set(data.news.map(n => {
    const title = n.title.toLowerCase();
    if (title.includes('gpt') || title.includes('openai')) return 'OpenAI';
    if (title.includes('claude') || title.includes('anthropic')) return 'Claude';
    if (title.includes('deepseek')) return 'DeepSeek';
    if (title.includes('miniMax')) return 'MiniMax';
    if (title.includes('agent')) return 'AI Agent';
    if (title.includes('视频') || title.includes('生成')) return 'AIGC';
    return 'AI';
  }))].slice(0, 6);

  const html = template({
    date,
    time,
    summary: data.aiSummary.summary,
    news: data.aiSummary.highlights,
    tags
  });

  // 输出目录
  const outputDir = path.join(process.cwd(), config.output.dir);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 写入文件
  const today = new Date().toISOString().split('T')[0];
  const filePath = path.join(outputDir, `${today}.html`);
  fs.writeFileSync(filePath, html);

  // 同时写入 index.html（最新）
  fs.writeFileSync(path.join(outputDir, 'index.html'), html);

  console.log(`✅ 网站已生成: ${filePath}\n`);

  return filePath;
}

module.exports = { generate };
