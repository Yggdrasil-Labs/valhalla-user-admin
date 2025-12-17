export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [1, 'always', 500], // 改为警告级别 + 120字符
    // 要求提交信息必须包含至少一个 issue 引用（如 #123、Closes #123、Fixes #123 等）
    // 'references-empty': [2, 'never'],
  },
}
