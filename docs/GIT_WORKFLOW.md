# Git 工作流规范

本文档定义了项目的 Git 工作流程、分支策略和提交规范，确保代码版本管理的一致性和可追溯性。

## 目录

- [分支策略](#分支策略)
- [提交信息规范](#提交信息规范)
- [工作流程](#工作流程)
- [代码审查流程](#代码审查流程)
- [发布流程](#发布流程)
- [Git 命令规范](#git-命令规范)
- [最佳实践](#最佳实践)

## 分支策略

我们采用 **Git Flow** 的简化版本，主要包含以下分支类型：

### 主要分支

#### `main` 分支
- **用途**：生产环境代码
- **特点**：始终保持稳定，可随时部署
- **保护**：禁止直接推送，只能通过 PR 合并
- **命名**：`main`

#### `develop` 分支
- **用途**：开发环境代码集成
- **特点**：包含最新的开发功能
- **来源**：从 `main` 分支创建
- **命名**：`develop`

### 辅助分支

#### 功能分支 (Feature Branches)
- **用途**：开发新功能
- **来源**：从 `develop` 分支创建
- **合并到**：`develop` 分支
- **命名规范**：`feature/功能描述`
- **示例**：
  ```
  feature/user-authentication
  feature/product-catalog
  feature/payment-integration
  ```

#### 修复分支 (Bugfix Branches)
- **用途**：修复开发环境中的 bug
- **来源**：从 `develop` 分支创建
- **合并到**：`develop` 分支
- **命名规范**：`bugfix/问题描述`
- **示例**：
  ```
  bugfix/login-validation-error
  bugfix/cart-calculation-issue
  ```

#### 热修复分支 (Hotfix Branches)
- **用途**：修复生产环境的紧急问题
- **来源**：从 `main` 分支创建
- **合并到**：`main` 和 `develop` 分支
- **命名规范**：`hotfix/问题描述`
- **示例**：
  ```
  hotfix/security-vulnerability
  hotfix/payment-gateway-error
  ```

#### 发布分支 (Release Branches)
- **用途**：准备新版本发布
- **来源**：从 `develop` 分支创建
- **合并到**：`main` 和 `develop` 分支
- **命名规范**：`release/版本号`
- **示例**：
  ```
  release/v1.2.0
  release/v2.0.0-beta
  ```

## 提交信息规范

我们采用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

### 提交信息格式

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 提交类型 (Type)

| 类型 | 描述 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: add user login functionality` |
| `fix` | Bug 修复 | `fix: resolve cart calculation error` |
| `docs` | 文档更新 | `docs: update API documentation` |
| `style` | 代码格式化（不影响功能） | `style: format code with prettier` |
| `refactor` | 代码重构 | `refactor: extract user service logic` |
| `perf` | 性能优化 | `perf: optimize image loading` |
| `test` | 测试相关 | `test: add unit tests for auth service` |
| `build` | 构建系统或依赖变更 | `build: update webpack configuration` |
| `ci` | CI/CD 配置变更 | `ci: add automated testing workflow` |
| `chore` | 其他维护性工作 | `chore: update dependencies` |
| `revert` | 回滚提交 | `revert: revert "feat: add user login"` |

### 作用域 (Scope)

可选，用于指定提交影响的范围：

```
feat(auth): add password reset functionality
fix(ui): resolve button alignment issue
docs(api): update endpoint documentation
```

常用作用域：
- `auth` - 认证相关
- `ui` - 用户界面
- `api` - API 相关
- `db` - 数据库相关
- `config` - 配置相关

### 描述 (Description)

- 使用现在时态："add" 而不是 "added"
- 首字母小写
- 不要以句号结尾
- 简洁明了，不超过 50 字符

### 提交信息示例

#### 简单提交
```
feat: add user registration form
fix: resolve memory leak in image component
docs: update installation guide
```

#### 带作用域的提交
```
feat(auth): implement OAuth2 integration
fix(ui): resolve responsive layout issues
perf(api): optimize database queries
```

#### 带详细描述的提交
```
feat: add advanced search functionality

Implement multi-criteria search with filters for:
- Product category
- Price range
- Brand
- Availability

Includes debounced input and pagination support.

Closes #123
```

#### 破坏性变更
```
feat!: change API response format

BREAKING CHANGE: API responses now use camelCase instead of snake_case

Migration guide:
- Update client code to handle new response format
- Use provided migration script: npm run migrate-api-format
```

## 工作流程

### 开发新功能

1. **创建功能分支**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/user-profile
   ```

2. **开发和提交**
   ```bash
   # 进行开发工作
   git add .
   git commit -m "feat: add user profile editing"
   ```

3. **推送分支**
   ```bash
   git push origin feature/user-profile
   ```

4. **创建 Pull Request**
   - 在 GitHub/GitLab 上创建 PR
   - 填写 PR 模板
   - 请求代码审查

5. **合并到 develop**
   - 通过代码审查后
   - 使用 "Squash and merge" 或 "Rebase and merge"
   - 删除功能分支

### 修复 Bug

1. **创建修复分支**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b bugfix/login-error
   ```

2. **修复和测试**
   ```bash
   # 修复 bug
   git add .
   git commit -m "fix: resolve login validation error"
   ```

3. **推送和合并**
   ```bash
   git push origin bugfix/login-error
   # 创建 PR 并合并
   ```

### 紧急热修复

1. **创建热修复分支**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/security-patch
   ```

2. **修复问题**
   ```bash
   git add .
   git commit -m "fix: patch security vulnerability"
   ```

3. **合并到 main 和 develop**
   ```bash
   # 合并到 main
   git checkout main
   git merge hotfix/security-patch
   git push origin main
   
   # 合并到 develop
   git checkout develop
   git merge hotfix/security-patch
   git push origin develop
   
   # 删除热修复分支
   git branch -d hotfix/security-patch
   ```

## 代码审查流程

### Pull Request 要求

1. **PR 标题**：遵循提交信息规范
2. **描述**：清楚说明变更内容和原因
3. **测试**：包含相关测试用例
4. **文档**：更新相关文档
5. **截图**：UI 变更需要提供截图

### PR 模板

```markdown
## 变更类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 破坏性变更
- [ ] 文档更新
- [ ] 性能优化
- [ ] 代码重构

## 变更描述
简要描述此次变更的内容和原因。

## 测试
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 手动测试完成

## 检查清单
- [ ] 代码遵循项目规范
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 没有引入新的警告
- [ ] 通过了所有检查

## 相关问题
Closes #issue_number

## 截图（如适用）
<!-- 添加截图 -->
```

### 审查标准

1. **代码质量**
   - 遵循编码规范
   - 逻辑清晰，易于理解
   - 没有明显的性能问题

2. **测试覆盖**
   - 包含适当的测试用例
   - 测试覆盖率达标
   - 边界情况处理

3. **安全性**
   - 没有安全漏洞
   - 输入验证充分
   - 敏感信息保护

4. **文档**
   - 代码注释充分
   - API 文档更新
   - 用户文档更新

## 发布流程

### 版本号规范

采用 [Semantic Versioning](https://semver.org/) (SemVer)：

```
MAJOR.MINOR.PATCH
```

- **MAJOR**：不兼容的 API 变更
- **MINOR**：向后兼容的功能新增
- **PATCH**：向后兼容的问题修复

示例：`1.2.3`, `2.0.0`, `1.5.0-beta.1`

### 发布步骤

1. **创建发布分支**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.2.0
   ```

2. **更新版本信息**
   ```bash
   # 更新 package.json 中的版本号
   npm version 1.2.0 --no-git-tag-version
   
   # 更新 CHANGELOG.md
   git add .
   git commit -m "chore: bump version to 1.2.0"
   ```

3. **测试和修复**
   ```bash
   # 运行完整测试套件
   npm test
   npm run e2e
   
   # 修复发现的问题
   git commit -m "fix: resolve issue found in release testing"
   ```

4. **合并到 main**
   ```bash
   git checkout main
   git merge release/v1.2.0
   git tag v1.2.0
   git push origin main --tags
   ```

5. **合并回 develop**
   ```bash
   git checkout develop
   git merge release/v1.2.0
   git push origin develop
   ```

6. **清理**
   ```bash
   git branch -d release/v1.2.0
   git push origin --delete release/v1.2.0
   ```

## Git 命令规范

### 常用命令

```bash
# 查看状态
git status

# 查看差异
git diff
git diff --staged

# 添加文件
git add .
git add <file>

# 提交
git commit -m "feat: add new feature"

# 推送
git push origin <branch-name>

# 拉取
git pull origin <branch-name>

# 切换分支
git checkout <branch-name>
git checkout -b <new-branch-name>

# 合并
git merge <branch-name>

# 变基
git rebase <branch-name>

# 查看日志
git log --oneline
git log --graph --oneline --all
```

### 高级操作

```bash
# 交互式变基（整理提交历史）
git rebase -i HEAD~3

# 暂存工作
git stash
git stash pop

# 撤销操作
git reset HEAD~1  # 撤销最后一次提交
git reset --hard HEAD~1  # 撤销并删除更改
git revert <commit-hash>  # 创建反向提交

# 查看分支
git branch -a  # 查看所有分支
git branch -d <branch-name>  # 删除本地分支
git push origin --delete <branch-name>  # 删除远程分支
```

## 最佳实践

### 提交频率

- **小而频繁**：每个提交应该是一个逻辑单元
- **完整功能**：确保每次提交都是可工作的状态
- **原子性**：一次提交只做一件事

### 分支管理

- **及时清理**：合并后删除功能分支
- **保持同步**：定期从 develop 拉取最新代码
- **避免长期分支**：功能分支不应存在超过一周

### 合并策略

- **功能分支**：使用 "Squash and merge" 保持历史清洁
- **发布分支**：使用 "Merge commit" 保留完整历史
- **热修复**：使用 "Merge commit" 确保可追溯

### 冲突解决

1. **预防冲突**
   ```bash
   # 开发前先同步
   git checkout develop
   git pull origin develop
   git checkout feature/my-feature
   git rebase develop
   ```

2. **解决冲突**
   ```bash
   # 当出现冲突时
   git status  # 查看冲突文件
   # 手动编辑冲突文件
   git add <resolved-files>
   git rebase --continue
   ```

### 代码回滚

```bash
# 回滚到特定提交
git revert <commit-hash>

# 回滚合并提交
git revert -m 1 <merge-commit-hash>

# 紧急回滚（生产环境）
git checkout main
git revert HEAD
git push origin main
```

### Git Hooks

设置 Git hooks 来自动化检查：

```bash
# pre-commit hook
#!/bin/sh
npm run lint
npm run test

# commit-msg hook
#!/bin/sh
# 验证提交信息格式
commit_regex='^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
    echo "Invalid commit message format!"
    echo "Format: type(scope): description"
    exit 1
fi
```

## 故障排除

### 常见问题

1. **提交信息写错了**
   ```bash
   git commit --amend -m "correct message"
   ```

2. **推送了错误的代码**
   ```bash
   git revert HEAD
   git push origin <branch-name>
   ```

3. **需要修改历史提交**
   ```bash
   git rebase -i HEAD~3
   # 在编辑器中修改提交
   ```

4. **分支合并错了**
   ```bash
   git reset --hard HEAD~1
   ```

### 紧急情况处理

1. **生产环境出现问题**
   - 立即创建 hotfix 分支
   - 快速修复并测试
   - 直接合并到 main
   - 同步到 develop

2. **错误发布到生产**
   - 立即回滚到上一个稳定版本
   - 分析问题原因
   - 修复后重新发布

---

## 工具推荐

- **Git GUI**：GitKraken, SourceTree, GitHub Desktop
- **命令行增强**：Oh My Zsh + Git 插件
- **提交信息**：Commitizen, gitmoji
- **自动化**：Husky, lint-staged
- **发布管理**：semantic-release, standard-version

遵循这些 Git 工作流规范可以确保：

1. 代码历史清晰可追溯
2. 团队协作更加顺畅
3. 发布流程标准化
4. 问题快速定位和修复
5. 代码质量持续提升

记住：**规范是为了提高效率，而不是增加负担**。团队应该根据实际情况调整这些规范。