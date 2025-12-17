import path from 'node:path'
import process from 'node:process'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    VueRouter({
      dts: 'src/types/typed-router.d.ts',
    }),
    vue(),
    Components({
      dts: 'src/types/components.d.ts',
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-i18n',
        'vue-router',
        'pinia',
        '@vueuse/core',
        VueRouterAutoImports,
      ],
      dts: 'src/types/auto-imports.d.ts',
      vueTemplate: true,
    }),
  ],
  test: {
    // 测试环境
    environment: 'happy-dom',

    // 全局设置
    globals: true,

    // 包含的文件模式
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],

    // 排除的文件模式
    exclude: [
      'node_modules',
      'dist',
      'tests/e2e/**',
      '**/*.config.*',
    ],

    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      // 只包含 src 目录的文件进行覆盖率统计
      include: [
        'src/**/*.{ts,vue}',
      ],
      exclude: [
        // 排除测试文件和配置文件
        '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}spec.{js,cjs,mjs,ts,tsx,jsx}',
        '**/__tests__/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
        '**/.{eslint,mocha,prettier}rc.{js,cjs,yml}',
        // 排除类型定义文件
        '**/*.d.ts',
        // 排除不需要测试的源码文件
        'src/types/**',
        'src/main.ts',
        'src/router/index.ts',
        'src/locales/**',
        'src/assets/**',
        'src/utils/initApp.ts',
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },

    // 设置文件
    setupFiles: ['./tests/setup/shared.ts'],

    // 测试超时时间
    testTimeout: process.env.CI ? 30000 : 10000,

    // 钩子超时时间
    hookTimeout: process.env.CI ? 30000 : 10000,

    // TypeScript 配置
    typecheck: {
      tsconfig: './tsconfig.test.json',
    },

    // 测试重试配置
    retry: process.env.CI ? 2 : 0,

    // Mock 清理配置
    clearMocks: true,
    restoreMocks: true,

    // 并发测试配置
    maxConcurrency: process.env.CI ? 2 : 5,

    // 测试环境隔离
    env: {
      NODE_ENV: 'test',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@scss/base/variables" as *; @use "@scss/base/mixins" as *;`,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@locales': path.resolve(__dirname, './src/locales'),
      '@scss': path.resolve(__dirname, './src/assets/scss'),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },
})
