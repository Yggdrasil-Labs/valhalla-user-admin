<script setup lang="ts">
import type { LoginInfo } from '@/types/store'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()

// 表单数据
const loginForm = reactive<LoginInfo>({
  username: '',
  password: '',
  remember: false,
})

// 表单验证状态
const formErrors = reactive({
  username: '',
  password: '',
})

// 表单引用
const formRef = ref<HTMLFormElement>()

/**
 * 验证用户名
 */
function validateUsername(): boolean {
  if (!loginForm.username.trim()) {
    formErrors.username = '请输入用户名'
    return false
  }
  if (loginForm.username.length < 3) {
    formErrors.username = '用户名至少3个字符'
    return false
  }
  formErrors.username = ''
  return true
}

/**
 * 验证密码
 */
function validatePassword(): boolean {
  if (!loginForm.password) {
    formErrors.password = '请输入密码'
    return false
  }
  if (loginForm.password.length < 6) {
    formErrors.password = '密码至少6个字符'
    return false
  }
  formErrors.password = ''
  return true
}

/**
 * 验证整个表单
 */
function validateForm(): boolean {
  const usernameValid = validateUsername()
  const passwordValid = validatePassword()
  return usernameValid && passwordValid
}

/**
 * 处理登录
 */
async function handleLogin() {
  if (!validateForm()) {
    return
  }

  try {
    const result = await userStore.login(loginForm)

    if (result.success) {
      // 登录成功，跳转到首页
      await router.push('/')
    }
    else {
      // 登录失败，显示错误信息
      console.error('登录失败:', result.message)
    }
  }
  catch (error) {
    console.error('登录异常:', error)
  }
}

/**
 * 处理表单提交
 */
function onSubmit(event: Event) {
  event.preventDefault()
  handleLogin()
}

/**
 * 清除错误信息
 */
function clearError(field: keyof typeof formErrors) {
  formErrors[field] = ''
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>欢迎登录</h1>
        <p>请输入您的账号信息</p>
      </div>

      <form ref="formRef" class="login-form" @submit="onSubmit">
        <div class="form-group">
          <label for="username" class="form-label">用户名</label>
          <input
            id="username"
            v-model="loginForm.username"
            type="text"
            class="form-input"
            :class="{ error: formErrors.username }"
            placeholder="请输入用户名"
            autocomplete="username"
            @blur="validateUsername"
            @input="clearError('username')"
          >
          <div v-if="formErrors.username" class="error-message">
            {{ formErrors.username }}
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">密码</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            class="form-input"
            :class="{ error: formErrors.password }"
            placeholder="请输入密码"
            autocomplete="current-password"
            @blur="validatePassword"
            @input="clearError('password')"
          >
          <div v-if="formErrors.password" class="error-message">
            {{ formErrors.password }}
          </div>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input
              v-model="loginForm.remember"
              type="checkbox"
              class="checkbox-input"
            >
            <span class="checkbox-text">记住我</span>
          </label>
        </div>

        <div class="form-group">
          <button
            type="submit"
            class="login-button"
            :disabled="userStore.loading"
            :class="{ loading: userStore.loading }"
          >
            <span v-if="userStore.loading" class="loading-spinner" />
            {{ userStore.loading ? '登录中...' : '登录' }}
          </button>
        </div>

        <div v-if="userStore.error" class="error-alert">
          {{ userStore.error }}
        </div>
      </form>

      <div class="login-footer">
        <p class="demo-info">
          <strong>演示账号：</strong><br>
          用户名：demo<br>
          密码：password
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-header {
  padding: 2rem 2rem 1rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  h1 {
    margin: 0 0 0.5rem;
    font-size: 1.8rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    opacity: 0.9;
    font-size: 0.9rem;
  }
}

.login-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &.error {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
}

.error-message {
  margin-top: 0.5rem;
  color: #ef4444;
  font-size: 0.8rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: #374151;
}

.checkbox-input {
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
}

.checkbox-text {
  user-select: none;
}

.login-button {
  width: 100%;
  padding: 0.875rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &.loading {
    background: #9ca3af;
  }
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-alert {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.9rem;
  text-align: center;
}

.login-footer {
  padding: 1rem 2rem 2rem;
  text-align: center;
  background: #f9fafb;
}

.demo-info {
  margin: 0;
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.5;

  strong {
    color: #374151;
  }
}

// 响应式设计
@media (max-width: 480px) {
  .login-page {
    padding: 1rem;
  }

  .login-container {
    max-width: none;
  }

  .login-header,
  .login-form,
  .login-footer {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}
</style>
