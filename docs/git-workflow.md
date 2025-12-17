# Git 工作流

本文档介绍了 Asgard Frontend Template 项目的 Git 工作流和协作规范。

## 📋 目录

- [分支策略](#分支策略)
- [提交规范](#提交规范)
- [代码审查](#代码审查)
- [发布流程](#发布流程)
- [冲突解决](#冲突解决)

## 🌿 分支策略

### 分支类型

项目采用 **Git Flow** 分支策略：

```
main (生产分支)
├── develop (开发分支)
├── feature/* (功能分支)
├── hotfix/* (热修复分支)
└── release/* (发布分支)
```

### 分支说明

#### 主分支

- **`main`**: 生产环境分支，只接受经过测试的稳定代码
- **`develop`**: 开发环境分支，集成所有功能开发

#### 功能分支

- **`feature/*`**: 功能开发分支
  - 命名格式: `feature/功能名称`
  - 示例: `feature/user-authentication`

#### 热修复分支

- **`hotfix/*`**: 紧急修复分支
  - 命名格式: `hotfix/问题描述`
  - 示例: `hotfix/login-validation-bug`

#### 发布分支

- **`release/*`**: 发布准备分支
  - 命名格式: `release/版本号`
  - 示例: `release/v1.2.0`

## 📝 提交规范

### Conventional Commits

项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 提交类型

| 类型       | 描述                   | 示例                                         |
| ---------- | ---------------------- | -------------------------------------------- |
| `feat`     | 新功能                 | `feat(auth): add login with social media`    |
| `fix`      | 修复 bug               | `fix(router): resolve navigation issue`      |
| `docs`     | 文档更新               | `docs: update API documentation`             |
| `style`    | 代码格式调整           | `style: fix eslint warnings`                 |
| `refactor` | 代码重构               | `refactor(components): extract common logic` |
| `test`     | 测试相关               | `test: add unit tests for user service`      |
| `chore`    | 构建过程或辅助工具变动 | `chore: update dependencies`                 |
| `perf`     | 性能优化               | `perf(api): optimize data fetching`          |
| `ci`       | CI/CD 相关             | `ci: add GitHub Actions workflow`            |
| `build`    | 构建系统相关           | `build: update webpack configuration`        |

### 提交示例

```bash
# 新功能
git commit -m "feat(auth): add two-factor authentication"

# 修复 bug
git commit -m "fix(ui): resolve button alignment issue in mobile"

# 破坏性变更
git commit -m "feat!: remove deprecated API endpoint"

# 文档更新
git commit -m "docs: update deployment guide"

# 多个提交
git commit -m "feat(auth): add login form

- Add email validation
- Add password strength indicator
- Add remember me checkbox

Closes #123"
```

### 提交信息最佳实践

1. **使用现在时态**: "add feature" 而不是 "added feature"
2. **首字母小写**: "fix bug" 而不是 "Fix bug"
3. **简洁明了**: 描述做了什么，而不是为什么做
4. **包含作用域**: 指明修改的模块或功能
5. **详细说明**: 在 body 中解释为什么和怎么做

## 🔍 代码审查

### 审查流程

1. **创建 Pull Request**

   ```bash
   # 推送功能分支
   git push origin feature/user-authentication

   # 在 GitHub/GitLab 创建 PR
   ```

2. **代码审查检查清单**
   - [ ] 代码符合项目规范
   - [ ] 类型定义完整且正确
   - [ ] 错误处理完善
   - [ ] 测试覆盖充分
   - [ ] 性能考虑合理
   - [ ] 安全性检查通过
   - [ ] 文档更新完整

3. **审查要点**
   - **功能正确性**: 代码是否实现了预期功能
   - **代码质量**: 是否遵循编码规范和最佳实践
   - **可维护性**: 代码是否易于理解和修改
   - **性能影响**: 是否对性能产生负面影响
   - **安全性**: 是否存在安全漏洞
   - **测试覆盖**: 是否有足够的测试用例

### 审查工具

#### GitHub Pull Request

```markdown
# .github/pull_request_template.md

## 变更描述

<!-- 描述本次变更的内容和目的 -->

## 变更类型

- [ ] Bug 修复
- [ ] 新功能
- [ ] 破坏性变更
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化

## 测试

- [ ] 单元测试
- [ ] 集成测试
- [ ] E2E 测试
- [ ] 手动测试

## 检查清单

- [ ] 代码符合项目规范
- [ ] 类型定义完整
- [ ] 错误处理完善
- [ ] 测试覆盖充分
- [ ] 文档更新完整

```

#### 自动化检查

```yaml
# .github/workflows/pr-check.yml
name: PR Check

on:
  pull_request:
    branches: [main, develop]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: pnpm
      - name: Install dependencies
        run: pnpm install
      - name: Type check
        run: pnpm type-check
      - name: Lint
        run: pnpm lint
      - name: Test
        run: pnpm test:run
```

## 🚀 发布流程

### 版本管理

项目使用 [Semantic Versioning](https://semver.org/) 规范：

- **MAJOR**: 不兼容的 API 变更
- **MINOR**: 向后兼容的功能新增
- **PATCH**: 向后兼容的问题修复

### 发布步骤

1. **创建发布分支**

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.2.0
   ```

2. **更新版本号**

   ```bash
   # 更新 package.json 版本号
   npm version minor

   # 更新 CHANGELOG.md
   # 添加新功能说明
   ```

3. **测试和修复**

   ```bash
   # 运行完整测试
   pnpm test:run
   pnpm test:e2e

   # 修复发现的问题
   git commit -m "fix: resolve issues found in release testing"
   ```

4. **合并到主分支**

   ```bash
   git checkout main
   git merge --no-ff release/v1.2.0
   git tag -a v1.2.0 -m "Release version 1.2.0"
   ```

5. **合并回开发分支**

   ```bash
   git checkout develop
   git merge --no-ff release/v1.2.0
   ```

6. **推送和发布**
   ```bash
   git push origin main
   git push origin develop
   git push origin v1.2.0
   ```

### 自动化发布

使用 `semantic-release` 自动化发布：

```json
// package.json
{
  "release": {
    "branches": ["main"],
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/changelog",
      "@semantic-release/npm",
      "@semantic-release/github",
      "@semantic-release/git"
    ]
  }
}
```

## ⚔️ 冲突解决

### 合并冲突

#### 预防冲突

1. **频繁同步**: 定期从主分支拉取最新代码

   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/my-feature
   git rebase develop
   ```

2. **小步提交**: 避免大文件提交，保持提交粒度小

3. **沟通协调**: 团队成员之间及时沟通，避免同时修改相同文件

#### 解决冲突

1. **识别冲突文件**

   ```bash
   git status
   # 查看冲突文件列表
   ```

2. **手动解决冲突**

   ```bash
   # 编辑冲突文件
   # 查找冲突标记
   <<<<<<< HEAD
   // 当前分支的代码
   =======
   // 合并分支的代码
   >>>>>>> branch-name

   # 选择保留的代码，删除冲突标记
   ```

3. **标记解决**
   ```bash
   git add resolved-file.js
   git commit -m "resolve: merge conflict in resolved-file.js"
   ```

### Rebase 冲突

#### 交互式 Rebase

```bash
# 开始交互式 rebase
git rebase -i HEAD~3

# 编辑提交
pick abc1234 feat: add new feature
edit def5678 fix: resolve bug
pick ghi9012 docs: update documentation

# 解决冲突
git add .
git rebase --continue
```

#### 中止 Rebase

```bash
# 如果 rebase 出现问题，可以中止
git rebase --abort
```

## 🔧 工具配置

### Git Hooks

使用 Husky 管理 Git hooks：

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

### Commitlint 配置

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'perf',
        'ci',
        'build',
      ],
    ],
    'subject-case': [2, 'never', ['pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
  },
}
```

### Lint-staged 配置

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx,vue,js,json,md,yml}": "eslint --fix",
    "*.{test,spec}.{ts,tsx,vue,js}": "eslint --fix"
  }
}
```

## 📊 最佳实践

### 提交频率

- **小步提交**: 每个提交应该是一个完整的功能或修复
- **频繁提交**: 避免长时间不提交，保持提交历史清晰
- **原子性**: 每个提交应该只做一件事

### 分支管理

- **及时删除**: 合并后及时删除功能分支
- **命名规范**: 使用清晰的分支命名
- **保护分支**: 设置主分支保护规则

### 代码审查

- **及时审查**: 尽快审查 Pull Request
- **建设性反馈**: 提供建设性的改进建议
- **学习机会**: 将代码审查视为学习机会

## 📚 相关文档

- [开发指南](./development-guide.md) - 项目结构和开发流程
- [编码规范](./coding-standards.md) - 编码规范和最佳实践
- [部署指南](./deployment-guide.md) - 构建和部署流程

---

**下一步**: 查看 [开发指南](./development-guide.md) 了解项目结构和开发流程。
