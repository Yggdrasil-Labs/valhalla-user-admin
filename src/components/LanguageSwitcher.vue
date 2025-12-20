<script setup lang="ts">
import type { Locale } from '@locales/types'
import { useI18nHelper } from '@/composables/useI18n'

// 使用 i18n 组合函数
const {
  currentLocale,
  switchLocale,
  getLocaleDisplayName,
  supportedLocales,
} = useI18nHelper()

// 处理语言切换
function handleLanguageChange(event: Event): void {
  const target = event.target as HTMLSelectElement
  const newLocale = target.value as Locale

  if (newLocale !== currentLocale.value) {
    switchLocale(newLocale)
    console.log(`Language changed to: ${newLocale}`)
  }
}
</script>

<template>
  <div class="language-switcher">
    <select
      :value="currentLocale"
      class="language-select"
      @change="handleLanguageChange"
    >
      <option
        v-for="locale in supportedLocales"
        :key="locale"
        :value="locale"
      >
        {{ getLocaleDisplayName(locale) }}
      </option>
    </select>
  </div>
</template>

<style lang="scss" scoped>
.language-switcher {
  display: inline-block;
}

.language-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  color: #1e293b;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}
</style>
