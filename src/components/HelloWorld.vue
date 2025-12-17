<script setup lang="ts">
import { useI18nHelper } from '@/composables/useI18n'

defineProps<{ msg: string }>()

const { t } = useI18nHelper()

const { count, inc, dec, reset } = useCounter(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <div class="button-group">
      <button type="button" @click="inc()">
        count is {{ count }}
      </button>
      <button type="button" @click="dec()">
        decrease
      </button>
      <button type="button" @click="reset()">
        reset
      </button>
    </div>
    <p>
      {{ t('button.edit') }}
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>
</template>

<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;

  .button-group {
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: center;
    align-items: center;
  }
}
</style>
