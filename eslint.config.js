// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  ignores: [
    '.github/**',
    '.vscode/**',
    'docs/**',
    '.cursor/**',
  ],
  rules: {
    'no-console': ['warn', {
      allow: ['log', 'warn', 'error'], // 允许常用的 console 方法
    }],
  },
  // 为测试文件添加特殊配置
  test: true,
  // 测试文件特殊规则
  testRules: {
    'no-console': 'off', // 测试文件中允许 console
    '@typescript-eslint/no-explicit-any': 'off', // 测试文件中允许 any
    'vue/multi-word-component-names': 'off', // 测试文件中允许单单词组件名
  },
})
