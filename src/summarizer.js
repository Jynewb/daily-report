const https = require('https');

// 使用MiniMax API进行总结
async function summarizeWithMiniMax(news, config) {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    console.log('⚠️ 无MiniMax API Key，使用简单总结');
    return simpleSummary(news);
  }

  const prompt = `请分析以下AI领域新闻，生成一份今日AI热点日报。要求：
1. 提取3-5个最重要的热点
2. 每个热点用50字以内总结
3. 按重要性排序

新闻列表：
${news.map((n, i) => `${i + 1}. ${n.title} - ${n.source}`).join('\n')}`;

  const postData = JSON.stringify({
    model: config.ai.model,
    messages: [
      { role: 'system', content: '你是一个专业的AI科技记者，擅长总结科技热点' },
      { role: 'user', content: prompt }
    ],
    temperature: config.ai.temperature,
    max_tokens: config.ai.maxTokens
  });

  const options = {
    hostname: 'api.minimax.chat',
    path: '/v1/text/chatcompletion_v2',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.choices && result.choices[0]) {
            resolve(result.choices[0].message.content);
          } else {
            resolve(simpleSummary(news));
          }
        } catch (e) {
          resolve(simpleSummary(news));
        }
      });
    });
    req.write(postData);
    req.on('error', () => resolve(simpleSummary(news)));
    req.end();
  });
}

// 简单总结（无API时使用）
function simpleSummary(news) {
  const topNews = news.slice(0, 5);
  return topNews.map((n, i) => `${i + 1}. ${n.title}`).join('\n\n');
}

// AI处理
async function summarize(news, config) {
  console.log('🤖 AI总结生成中...\n');

  const summary = await summarizeWithMiniMax(news, config);

  console.log('✅ 总结生成完成\n');

  return {
    summary,
    highlights: news.slice(0, 5).map(n => ({
      title: n.title,
      url: n.url,
      source: n.source
    }))
  };
}

module.exports = { summarize };
