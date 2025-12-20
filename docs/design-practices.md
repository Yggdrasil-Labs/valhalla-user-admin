# 设计规范的最佳实践

本文档定义了 Valhalla User Admin 项目的设计规范，确保界面的一致性和可维护性。

## 📋 目录

- [设计原则](#设计原则)
- [布局规范](#布局规范)
- [栅格系统](#栅格系统)
- [间距规范](#间距规范)
- [颜色规范](#颜色规范)
- [字体规范](#字体规范)
- [像素单位规范](#像素单位规范)
- [动效规范](#动效规范)
- [组件设计规范](#组件设计规范)

## 🎯 设计原则

### 核心原则

1. **少颜色、多留白**
   - 使用简洁的配色方案，避免过度使用颜色
   - 通过留白创造视觉层次，提升可读性
   - 保持界面的简洁和专业

2. **动效只为反馈服务**
   - 所有动效必须有明确的功能目的
   - 用于提供操作反馈、状态变化提示
   - 避免装饰性动效，保持性能

3. **语义化设计**
   - 使用语义化的颜色变量和样式类名
   - 确保设计系统的一致性和可维护性
   - 便于主题切换和样式定制

## 📐 布局规范

### 页面布局结构

```
┌─────────────────────────────────────────┐
│           Navbar (64px)                │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │      Main Content            │
│ (240px)  │      (自适应宽度)             │
│          │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

### 布局尺寸

- **导航栏高度**: `64px`
- **侧边栏宽度**: `240px`（展开）/ `64px`（收起）
- **内容区域**: 自适应，最大宽度 `1400px`
- **内容内边距**: `24px`（桌面端）/ `16px`（移动端）

### 布局实现

```vue
<template>
  <div class="app-layout">
    <Navbar />
    <div class="layout-container">
      <Sidebar />
      <main class="main-content">
        <div class="content-wrapper">
          <!-- 页面内容 -->
        </div>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-layout {
  min-height: 100vh;
}

.layout-container {
  display: flex;
  margin-top: 64px; // 导航栏高度
}

.main-content {
  flex: 1;
  margin-left: 240px; // 侧边栏宽度
  padding: 24px;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.content-wrapper {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
```

### 响应式布局

```scss
// 使用断点混入
@include respond-below(md) {
  .main-content {
    margin-left: 0;
    padding: 16px;
  }
  
  .content-wrapper {
    padding: 16px;
  }
}
```

## 🔲 栅格系统

### 栅格基础

项目采用 **24 列栅格系统**，基于 Flexbox 实现。

### 栅格断点

```scss
// 断点定义（来自 _variables.scss）
$breakpoints: (
  sm: 640px,   // 小屏幕（手机）
  md: 768px,   // 中等屏幕（平板）
  lg: 1024px,  // 大屏幕（桌面）
  xl: 1280px,  // 超大屏幕
);
```

### 栅格使用示例

```vue
<template>
  <n-grid :cols="24" :x-gap="16">
    <!-- 左侧内容：16 列 -->
    <n-grid-item :span="16">
      <div class="content-card">主要内容</div>
    </n-grid-item>
    
    <!-- 右侧内容：8 列 -->
    <n-grid-item :span="8">
      <div class="sidebar-card">侧边栏</div>
    </n-grid-item>
  </n-grid>
</template>
```

### 响应式栅格

```vue
<template>
  <n-grid :cols="24" :x-gap="16" responsive="screen">
    <!-- 桌面端：16+8，移动端：24 -->
    <n-grid-item :span="24" :s-span="16">
      <div class="content-card">主要内容</div>
    </n-grid-item>
    
    <n-grid-item :span="24" :s-span="8">
      <div class="sidebar-card">侧边栏</div>
    </n-grid-item>
  </n-grid>
</template>
```

### 栅格间距

- **列间距（x-gap）**: `16px`（桌面端）/ `12px`（移动端）
- **行间距（y-gap）**: `16px`（桌面端）/ `12px`（移动端）

## 📏 间距规范

### 8px 间距体系

项目采用 **8px 基础间距单位**，所有间距值应为 8px 的倍数。

### 间距值定义

```scss
// 间距系统（来自 _variables.scss）
$spacings: (
  0: 0,        // 0px
  1: 0.25rem,  // 4px  (0.5 × 8px)
  2: 0.5rem,   // 8px  (1 × 8px) ⭐ 基础单位
  3: 0.75rem,  // 12px (1.5 × 8px)
  4: 1rem,     // 16px (2 × 8px)
  6: 1.5rem,   // 24px (3 × 8px)
  8: 2rem,     // 32px (4 × 8px)
  12: 3rem,    // 48px (6 × 8px)
  16: 4rem,    // 64px (8 × 8px)
);
```

### 间距使用指南

#### 组件内部间距

```scss
.card {
  padding: 24px;        // 3 × 8px
  margin-bottom: 16px;  // 2 × 8px
  
  .card-header {
    margin-bottom: 16px; // 2 × 8px
  }
  
  .card-body {
    padding: 16px;        // 2 × 8px
  }
}
```

#### 元素间距

```vue
<template>
  <div class="form-group">
    <n-space :size="16" vertical>
      <n-form-item label="用户名">
        <n-input />
      </n-form-item>
      <n-form-item label="密码">
        <n-input type="password" />
      </n-form-item>
    </n-space>
  </div>
</template>
```

#### 页面间距

```scss
.page-container {
  padding: 24px;           // 页面内边距：3 × 8px
  
  .section {
    margin-bottom: 32px;  // 区块间距：4 × 8px
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}
```

### 间距使用原则

1. **一致性**: 同一层级使用相同的间距值
2. **层次性**: 不同层级使用不同的间距值
3. **呼吸感**: 适当留白，避免元素过于紧密

## 🎨 颜色规范

### 语义化颜色变量

使用语义化的颜色变量，而非直接使用颜色值。

### 颜色系统定义

```scss
// 颜色系统（来自 _variables.scss）
$colors: (
  // 基础色
  white: #ffffff,
  black: #000000,
  
  // 中性色 - 用于文本和背景
  gray-50: #f8fafc,   // 最浅背景
  gray-100: #f1f5f9,  // 浅背景
  gray-200: #e2e8f0,  // 边框/分割线
  gray-300: #cbd5e1,  // 禁用状态
  gray-400: #94a3b8,  // 次要文本
  gray-500: #64748b,  // 辅助文本
  gray-600: #475569,  // 次要文本
  gray-700: #334155,  // 正文文本
  gray-800: #1e293b,  // 标题文本
  gray-900: #0f172a,  // 强调文本
);
```

### 语义化颜色使用

```scss
// ❌ 错误：直接使用颜色值
.text {
  color: #334155;
  background: #f8fafc;
}

// ✅ 正确：使用语义化变量
.text {
  color: map.get($colors, gray-700);  // 正文文本
  background: map.get($colors, gray-50); // 浅背景
}
```

### 颜色使用场景

#### 文本颜色

```scss
// 标题文本
.heading {
  color: map.get($colors, gray-900); // 最深的灰色
}

// 正文文本
.body-text {
  color: map.get($colors, gray-700); // 中等灰色
}

// 次要文本
.secondary-text {
  color: map.get($colors, gray-500); // 浅灰色
}

// 禁用文本
.disabled-text {
  color: map.get($colors, gray-300); // 最浅灰色
}
```

#### 背景颜色

```scss
// 主背景
.main-bg {
  background: map.get($colors, white);
}

// 浅背景（卡片、区块）
.card-bg {
  background: map.get($colors, gray-50);
}

// 边框颜色
.border {
  border-color: map.get($colors, gray-200);
}
```

#### 状态颜色

```scss
// 成功状态（建议使用 UI 组件库的主题色）
.success {
  color: #10b981; // 绿色
  background: #d1fae5; // 浅绿色背景
}

// 警告状态
.warning {
  color: #f59e0b; // 橙色
  background: #fef3c7; // 浅橙色背景
}

// 错误状态
.error {
  color: #ef4444; // 红色
  background: #fee2e2; // 浅红色背景
}

// 信息状态
.info {
  color: #3b82f6; // 蓝色
  background: #dbeafe; // 浅蓝色背景
}
```

### 颜色使用原则

1. **少颜色**: 优先使用中性色，谨慎使用彩色
2. **语义化**: 使用语义化的颜色变量名
3. **对比度**: 确保文本与背景有足够的对比度（WCAG AA 标准）
4. **一致性**: 相同场景使用相同的颜色

## 📝 字体规范

### 字体大小

项目采用 **14px 作为正文字号**，其他字号基于此进行缩放。

```scss
// 字体大小（来自 _variables.scss）
$font-sizes: (
  sm: 0.875rem,   // 14px ⭐ 正文字号
  base: 1rem,     // 16px
  lg: 1.125rem,   // 18px
  xl: 1.25rem,    // 20px
  2xl: 1.5rem,    // 24px
  3xl: 1.875rem,  // 30px
);
```

### 字体使用场景

```scss
// 正文
.body-text {
  font-size: map.get($font-sizes, sm); // 14px
  line-height: 1.5;
}

// 小号文本（辅助信息）
.small-text {
  font-size: 0.75rem; // 12px
  line-height: 1.4;
}

// 标题
.heading-1 {
  font-size: map.get($font-sizes, 3xl); // 30px
  font-weight: 700;
  line-height: 1.2;
}

.heading-2 {
  font-size: map.get($font-sizes, 2xl); // 24px
  font-weight: 600;
  line-height: 1.3;
}

.heading-3 {
  font-size: map.get($font-sizes, xl); // 20px
  font-weight: 600;
  line-height: 1.4;
}
```

### 字体粗细

```scss
// 字体粗细（来自 _variables.scss）
$font-weights: (
  normal: 400,    // 正文
  medium: 500,    // 中等强调
  semibold: 600,  // 标题
  bold: 700,      // 强调标题
);
```

### 行高规范

- **正文**: `1.5`（21px / 14px）
- **标题**: `1.2` - `1.4`
- **小号文本**: `1.4`

### 字体使用示例

```vue
<template>
  <div class="text-example">
    <h1 class="heading-1">一级标题</h1>
    <h2 class="heading-2">二级标题</h2>
    <p class="body-text">这是正文内容，使用 14px 字号。</p>
    <span class="small-text">这是辅助信息，使用 12px 字号。</span>
  </div>
</template>

<style lang="scss" scoped>
.heading-1 {
  font-size: 1.875rem; // 30px
  font-weight: 700;
  line-height: 1.2;
  color: map.get($colors, gray-900);
  margin-bottom: 16px;
}

.heading-2 {
  font-size: 1.5rem; // 24px
  font-weight: 600;
  line-height: 1.3;
  color: map.get($colors, gray-800);
  margin-bottom: 12px;
}

.body-text {
  font-size: 0.875rem; // 14px
  line-height: 1.5;
  color: map.get($colors, gray-700);
  margin-bottom: 8px;
}

.small-text {
  font-size: 0.75rem; // 12px
  line-height: 1.4;
  color: map.get($colors, gray-500);
}
</style>
```

## 📐 像素单位规范

### px 为主（中后台）

中后台管理系统以 **px 为主**，原因：

1. **精确控制**: 中后台界面需要精确的像素级控制
2. **一致性**: 确保在不同设备上显示一致
3. **可预测性**: px 单位更直观，便于设计和开发协作

### 单位使用指南

#### 优先使用 px

```scss
// ✅ 正确：使用 px
.card {
  width: 400px;
  padding: 24px;
  margin-bottom: 16px;
  border-radius: 8px;
  font-size: 14px;
}

.button {
  height: 32px;
  padding: 0 16px;
  font-size: 14px;
}
```

#### 可适当使用 rem

```scss
// ✅ 可以：字体大小使用 rem（便于整体缩放）
.text {
  font-size: 0.875rem; // 14px (基于 16px 根字体)
}

// ✅ 可以：间距使用 rem（保持相对关系）
.spacing {
  margin: 1.5rem; // 24px
}
```

#### 避免使用 em

```scss
// ❌ 避免：em 单位在嵌套中难以控制
.nested {
  font-size: 1.2em; // 会受父元素影响
}
```

### 响应式单位

```scss
// 固定尺寸（px）
.fixed-width {
  width: 400px;
}

// 响应式尺寸（百分比 + max-width）
.responsive-width {
  width: 100%;
  max-width: 1400px;
}

// 响应式尺寸（vw/vh，谨慎使用）
.fullscreen {
  width: 100vw;
  height: 100vh;
}
```

### 单位转换参考

```scss
// 常用转换（基于 16px 根字体）
// 8px = 0.5rem
// 12px = 0.75rem
// 14px = 0.875rem ⭐ 正文字号
// 16px = 1rem
// 24px = 1.5rem
// 32px = 2rem
```

## ✨ 动效规范

### 动效只为反馈服务

所有动效必须有明确的功能目的，用于：

1. **操作反馈**: 按钮点击、表单提交等
2. **状态变化**: 加载、成功、错误等状态提示
3. **导航过渡**: 页面切换、模态框打开/关闭
4. **数据更新**: 列表更新、数据刷新

### 动效时长

```scss
// 过渡动画（来自 _variables.scss）
$transitions: (
  fast: 150ms ease-in-out,   // 快速反馈（按钮点击）
  base: 250ms ease-in-out,   // 标准过渡（默认）
  slow: 350ms ease-in-out,   // 慢速过渡（复杂动画）
);
```

### 动效使用场景

#### 按钮反馈

```vue
<template>
  <n-button
    :loading="loading"
    @click="handleClick"
  >
    提交
  </n-button>
</template>

<style lang="scss" scoped>
// 按钮悬停效果
.n-button {
  transition: all 150ms ease-in-out;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
}
</style>
```

#### 状态变化

```vue
<template>
  <div class="status-indicator" :class="status">
    <span>{{ message }}</span>
  </div>
</template>

<style lang="scss" scoped>
.status-indicator {
  transition: all 250ms ease-in-out;
  
  &.success {
    background: #d1fae5;
    color: #10b981;
  }
  
  &.error {
    background: #fee2e2;
    color: #ef4444;
  }
}
</style>
```

#### 页面过渡

```vue
<template>
  <transition name="fade">
    <router-view />
  </router-view>
</template>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 250ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

#### 列表更新

```vue
<template>
  <div class="list-item" v-for="item in items" :key="item.id">
    {{ item.name }}
  </div>
</template>

<style lang="scss" scoped>
.list-item {
  animation: slideInUp 250ms ease-out;
}

@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
```

### 动效原则

1. **快速**: 动效时长不超过 350ms
2. **自然**: 使用 ease-in-out 缓动函数
3. **一致**: 相同场景使用相同的动效
4. **性能**: 使用 transform 和 opacity，避免触发重排

### 禁止的动效

- ❌ 装饰性动效（无功能目的）
- ❌ 过长的动效（超过 500ms）
- ❌ 过于复杂的动效（影响性能）
- ❌ 自动播放的动效（干扰用户）

## 🧩 组件设计规范

### 组件尺寸

```scss
// 按钮高度
.button-sm { height: 24px; font-size: 12px; padding: 0 12px; }
.button-md { height: 32px; font-size: 14px; padding: 0 16px; } // 默认
.button-lg { height: 40px; font-size: 16px; padding: 0 20px; }

// 输入框高度
.input-sm { height: 24px; font-size: 12px; padding: 0 12px; }
.input-md { height: 32px; font-size: 14px; padding: 0 12px; } // 默认
.input-lg { height: 40px; font-size: 16px; padding: 0 16px; }

// 卡片圆角
.card-sm { border-radius: 4px; }
.card-md { border-radius: 8px; } // 默认
.card-lg { border-radius: 12px; }
```

### 组件间距

```scss
// 组件内部间距
.component {
  padding: 16px;        // 内部间距：2 × 8px
  
  .component-header {
    margin-bottom: 16px; // 头部间距：2 × 8px
  }
  
  .component-body {
    padding: 16px;        // 内容间距：2 × 8px
  }
  
  .component-footer {
    margin-top: 16px;    // 底部间距：2 × 8px
    padding-top: 16px;   // 顶部内边距：2 × 8px
    border-top: 1px solid map.get($colors, gray-200);
  }
}
```

### 组件阴影

```scss
// 阴影系统（来自 _variables.scss）
$shadows: (
  sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05),      // 轻微阴影
  base: 0 1px 3px 0 rgba(0, 0, 0, 0.1),     // 标准阴影
  md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),    // 中等阴影
  lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),  // 大阴影
);

// 使用示例
.card {
  box-shadow: map.get($shadows, base);
  
  &:hover {
    box-shadow: map.get($shadows, md);
  }
}
```

### 组件圆角

```scss
// 圆角系统（来自 _variables.scss）
$border-radius: (
  none: 0,
  sm: 0.125rem,  // 2px
  base: 0.25rem, // 4px
  md: 0.375rem,  // 6px
  lg: 0.5rem,    // 8px
  xl: 0.75rem,   // 12px
  full: 9999px,  // 完全圆形
);

// 使用示例
.button {
  border-radius: map.get($border-radius, base); // 4px
}

.card {
  border-radius: map.get($border-radius, lg); // 8px
}

.avatar {
  border-radius: map.get($border-radius, full); // 圆形
}
```

## 📚 最佳实践总结

### 设计检查清单

在开发新组件或页面时，请检查：

- [ ] 使用 8px 间距体系
- [ ] 正文字号为 14px
- [ ] 使用语义化颜色变量
- [ ] 使用 px 单位（中后台）
- [ ] 保持简洁的配色（少颜色、多留白）
- [ ] 动效有明确的功能目的
- [ ] 遵循布局和栅格规范
- [ ] 响应式设计适配移动端

### 代码示例

```vue
<template>
  <div class="example-page">
    <div class="page-header">
      <h1 class="page-title">页面标题</h1>
    </div>
    
    <div class="page-content">
      <n-grid :cols="24" :x-gap="16">
        <n-grid-item :span="16">
          <div class="content-card">
            <h2 class="section-title">主要内容</h2>
            <p class="body-text">这是正文内容，使用 14px 字号。</p>
          </div>
        </n-grid-item>
        
        <n-grid-item :span="8">
          <div class="sidebar-card">
            <h3 class="sidebar-title">侧边栏</h3>
          </div>
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.example-page {
  padding: 24px; // 3 × 8px
}

.page-header {
  margin-bottom: 32px; // 4 × 8px
}

.page-title {
  font-size: 1.875rem; // 30px
  font-weight: 700;
  line-height: 1.2;
  color: map.get($colors, gray-900);
}

.page-content {
  // 内容区域样式
}

.content-card,
.sidebar-card {
  background: map.get($colors, white);
  border-radius: 8px;
  padding: 24px; // 3 × 8px
  box-shadow: map.get($shadows, base);
  border: 1px solid map.get($colors, gray-200);
}

.section-title {
  font-size: 1.5rem; // 24px
  font-weight: 600;
  line-height: 1.3;
  color: map.get($colors, gray-800);
  margin-bottom: 16px; // 2 × 8px
}

.sidebar-title {
  font-size: 1.25rem; // 20px
  font-weight: 600;
  line-height: 1.4;
  color: map.get($colors, gray-800);
  margin-bottom: 12px; // 1.5 × 8px
}

.body-text {
  font-size: 0.875rem; // 14px
  line-height: 1.5;
  color: map.get($colors, gray-700);
}
</style>
```

## 🔗 相关资源

- [样式变量定义](../src/assets/scss/base/_variables.scss)
- [样式混入](../src/assets/scss/base/_mixins.scss)
- [最佳实践](./best-practices.md)
- [编码规范](./coding-standards.md)
