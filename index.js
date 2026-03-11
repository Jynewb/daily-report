const fs = require('fs');
const path = require('path');
const { collect } = require('./src/collector');
const { summarize } = require('./src/summarizer');
const { generate } = require('./src/generator');

// 加载配置
const config = require('./config');

async function main() {
  console.log('='.repeat(50));
  console.log('🚀 AI Daily Report 开始运行');
  console.log('='.repeat(50) + '\n');

  try {
    // 1. 收集信息
    const newsData = await collect(config);

    // 2. AI总结
    const aiSummary = await summarize(newsData.news, config);

    // 3. 整合数据
    const reportData = {
      timestamp: newsData.timestamp,
      news: newsData.news,
      aiSummary
    };

    // 4. 生成网站
    const outputPath = generate(reportData, config);

    console.log('='.repeat(50));
    console.log('✅ 今日日报生成完成!');
    console.log(`📁 输出文件: ${outputPath}`);
    console.log('='.repeat(50));

    // 保存数据供后续使用
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const today = new Date().toISOString().split('T')[0];
    fs.writeFileSync(
      path.join(dataDir, `${today}.json`),
      JSON.stringify(reportData, null, 2)
    );

  } catch (error) {
    console.error('❌ 运行错误:', error);
    process.exit(1);
  }
}

main();
