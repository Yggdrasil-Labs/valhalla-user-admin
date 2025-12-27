<script setup lang="ts">
interface Props {
  /** 搜索值 */
  modelValue: string
  /** 搜索占位符 */
  placeholder?: string
  /** 是否显示筛选 */
  showFilter?: boolean
  /** 筛选选项 */
  filterOptions?: Array<{ label: string, value: any }>
  /** 当前筛选值 */
  filterValue?: any
  /** 搜索框宽度 */
  width?: string | number
  /** 筛选框宽度 */
  filterWidth?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入搜索关键词',
  showFilter: false,
  width: 300,
  filterWidth: 200,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:filterValue': [value: any]
  'search': [value: string]
  'filter': [value: any]
}>()

const searchValue = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    emit('update:modelValue', value)
  },
})

const filterValueModel = computed({
  get: () => props.filterValue,
  set: (value: any) => {
    emit('update:filterValue', value)
    emit('filter', value)
  },
})

function handleSearch() {
  emit('search', searchValue.value)
}

function handleKeyup(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleSearch()
  }
}
</script>

<template>
  <div class="search-bar">
    <div v-if="showFilter && filterOptions" class="search-bar-filter">
      <n-select
        v-model:value="filterValueModel"
        :options="filterOptions"
        placeholder="筛选"
        clearable
        :style="{ width: typeof filterWidth === 'number' ? `${filterWidth}px` : filterWidth }"
      />
    </div>
    <div class="search-bar-input">
      <n-input
        v-model:value="searchValue"
        :placeholder="placeholder"
        clearable
        :style="{ width: typeof width === 'number' ? `${width}px` : width }"
        @keyup="handleKeyup"
      >
        <template #suffix>
          <n-icon class="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </n-icon>
        </template>
      </n-input>
    </div>
    <div class="search-bar-button">
      <n-button type="primary" @click="handleSearch">
        搜索
      </n-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use '@/assets/scss/base/variables' as *;

.search-bar {
  display: flex;
  align-items: center;
  gap: map.get($spacings, 2); // 8px
}

.search-bar-filter {
  flex-shrink: 0;
}

.search-bar-input {
  flex-shrink: 0;
  position: relative;

  .search-icon {
    color: map.get($colors, gray-400);
  }
}

.search-bar-button {
  flex-shrink: 0;
}

// 响应式设计
@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    align-items: stretch;
    gap: map.get($spacings, 2); // 8px
  }

  .search-bar-input,
  .search-bar-filter {
    width: 100% !important;
  }
}
</style>
