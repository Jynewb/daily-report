const https = require('https');
const { execSync } = require('child_process');

// 简单的HTTP GET请求
function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// 使用Tavily API搜索
function searchWithTavily(query) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    console.log('⚠️ 无Tavily API Key，使用备用搜索');
    return fallbackSearch(query);
  }

  const postData = JSON.stringify({
    query: query,
    max_results: 5,
    include_answer: true,
    include_raw_content: false
  });

  const options = {
    hostname: 'api.tavily.com',
    path: '/search',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.results || []);
        } catch (e) {
          resolve([]);
        }
      });
    });
    req.write(postData);
    req.end();
  });
}

// 备用搜索（使用Bing API或本地搜索）
function fallbackSearch(query) {
  console.log(`🔍 备用搜索: ${query}`);
  return [];
}

// 收集信息
async function collect(config) {
  console.log('📥 开始收集信息...\n');

  const results = {
    timestamp: new Date().toISOString(),
    topics: [],
    news: [],
    videos: []
  };

  // 搜索关键词
  for (const keyword of config.keywords) {
    console.log(`🔍 搜索: ${keyword}`);
    const searchResults = await searchWithTavily(keyword);
    results.news.push(...searchResults.map(r => ({
      title: r.title,
      url: r.url,
      content: r.content || r.url,
      source: r.source || 'unknown'
    })));
    await new Promise(r => setTimeout(r, 1000)); // 避免API限流
  }

  // 去重
  const seen = new Set();
  results.news = results.news.filter(item => {
    const key = item.title + item.url;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`✅ 收集到 ${results.news.length} 条资讯\n`);

  return results;
}

module.exports = { collect };
