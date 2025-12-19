<script setup lang="ts">
</script>

<template>
  <n-config-provider>
    <n-message-provider>
      <n-dialog-provider>
        <div class="app">
          <RouterView />
        </div>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
  max-width: 100vw;
  margin: 0 auto;
  text-align: center;
}
</style>
