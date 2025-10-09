// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock auto-imports and Nuxt app APIs before importing the middleware
vi.mock('#imports', () => ({
  useLocalePath: () => (p: string) => p,
  useUserStore: () => ({ fetchUserData: vi.fn() }),
  useUserSettingsStore: () => ({ fetchUserSettings: vi.fn() }),
  storeToRefs: () => ({ isLogin: { value: false } }),
}))

// Some packages import from 'nuxt/app' directly; stub it to avoid real Nuxt instance
vi.mock('nuxt/app', () => ({
  defineNuxtRouteMiddleware: (fn: any) => fn,
  navigateTo: (p: string) => p,
  useNuxtApp: () => ({}),
}))

// In case runtime resolves to '#app' alias instead
vi.mock('#app', () => ({
  defineNuxtRouteMiddleware: (fn: any) => fn,
  navigateTo: (p: string) => p,
  useNuxtApp: () => ({}),
}))


import middleware from './auth'

describe('auth middleware', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('not logged in -> redirect to /login', async () => {
    const result = await middleware({} as any, { fullPath: '/from' } as any)
    expect(result).toContain('/login')
  })
})
