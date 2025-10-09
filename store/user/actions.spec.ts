// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

describe('User Actions', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('claims が null のとき未ログイン扱い', async () => {
    vi.resetModules()
    vi.doMock('#imports', () => ({
      useSupabaseUser: () => ({ value: null }),
      useSupabaseClient: () => ({ auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { user_metadata: {} } }, error: null }) } }),
    }))
    const { useUserState } = await import('./state')
    const { useUserActions } = await import('./actions')
    const { isLogin, userName, userAvatarUrl } = useUserState()
    const { fetchUserData } = useUserActions()
    await fetchUserData()
    expect(isLogin.value).toBe(false)
    expect(userName.value).toBeNull()
    expect(userAvatarUrl.value).toBeNull()
  })

  it('claims が存在し、getUser 失敗時は安全に null をセット', async () => {
    vi.resetModules()
    vi.doMock('#imports', () => ({
      useSupabaseUser: () => ({ value: { sub: 'uid' } }),
      useSupabaseClient: () => ({ auth: { getUser: vi.fn().mockResolvedValue({ data: {}, error: new Error('x') }) } }),
    }))
    const { useUserState } = await import('./state')
    const { useUserActions } = await import('./actions')
    const { isLogin, userName, userAvatarUrl } = useUserState()
    const { fetchUserData } = useUserActions()
    await fetchUserData()
    expect(isLogin.value).toBe(true)
    expect(userName.value).toBeNull()
    expect(userAvatarUrl.value).toBeNull()
  })
})
