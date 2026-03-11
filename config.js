module.exports = {
  // 关注领域关键词
  keywords: [
    'AI 人工智能',
    'OpenAI GPT',
    'Claude Anthropic',
    'DeepSeek',
    'MiniMax 大模型',
    '智谱AI',
    'AI Agent 智能体'
  ],

  // 信息源配置
  sources: {
    // 国内AI资讯
    zh: [
      { name: '机器之心', url: 'https://www.jiqizhixin.com' },
      { name: '量子位', url: 'https://www.qbitai.com' },
      { name: '36氪AI', url: 'https://www.36kr.com/information/AI' },
      { name: '爱范儿', url: 'https://www.ifanr.com' }
    ],
    // 国际AI资讯
    en: [
      { name: 'TechCrunch AI', url: 'https://techcrunch.com/tag/ai/' },
      { name: 'VentureBeat AI', url: 'https://venturebeat.com/ai/' }
    ],
    // YouTube频道
    youtube: [
      { name: '影视飓风', id: 'UC2nO8nJz9-kI2-ZRDRLtv8Q' },
      { name: '神烦老狗', id: 'UC463P4AnN6sC2xIzrRJk5EA' },
      { name: '秋芝2046', id: 'UCgP2qU9U--Cl7F8r0oU9vLQ' }
    ]
  },

  // AI总结配置
  ai: {
    provider: 'minimax',
    model: 'abab6.5s-chat',
    temperature: 0.7,
    maxTokens: 2000
  },

  // 输出配置
  output: {
    dir: 'output',
    branch: 'gh-pages'
  }
};
