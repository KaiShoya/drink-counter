import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const {
  mockFetchUserData,
  mockUseUserStore,
  mockNavigateTo,
  mockUseLocalePath,
  mockStoreToRefs,
  mockUseSupabaseUser,
} = vi.hoisted(() => ({
  mockFetchUserData: vi.fn().mockResolvedValue(undefined),
  mockUseUserStore: vi.fn(),
  mockNavigateTo: vi.fn((value) => value),
  mockUseLocalePath: vi.fn(),
  mockStoreToRefs: vi.fn(),
  mockUseSupabaseUser: vi.fn(),
}))

mockNuxtImport('navigateTo', () => mockNavigateTo)
mockNuxtImport('useLocalePath', () => mockUseLocalePath)
mockNuxtImport('storeToRefs', () => mockStoreToRefs)
mockNuxtImport('useSupabaseUser', () => mockUseSupabaseUser)

vi.mock('~/stores/user', () => ({
  useUserStore: mockUseUserStore,
}))

describe('auth.global middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseUserStore.mockReturnValue({
      fetchUserData: mockFetchUserData,
    })
    mockUseLocalePath.mockReturnValue((value: unknown) => value)
    mockStoreToRefs.mockReturnValue({
      isLogin: { value: false },
      isInitialized: { value: true },
    })
    mockUseSupabaseUser.mockReturnValue({ value: null })
  })

  it('未ログインで protected へ遷移時は to.fullPath を fullpath クエリに保持する', async () => {
    const middleware = (await import('./auth.global')).default

    const to = {
      path: '/dashboard',
      fullPath: '/dashboard?tab=monthly',
      query: {},
      meta: { groups: ['protected'] },
    }
    const from = { fullPath: '/confirm' }

    const result = await middleware(to as never, from as never)

    expect(result).toEqual({
      path: '/login',
      query: {
        fullpath: '/dashboard?tab=monthly',
      },
    })
    expect(mockNavigateTo).toHaveBeenCalledTimes(1)
  })

  it('store が未ログインでも Supabase セッションがあれば認証状態を再取得する', async () => {
    const middleware = (await import('./auth.global')).default

    const isLoginRef = { value: false }
    const isInitializedRef = { value: true }
    mockStoreToRefs.mockReturnValue({
      isLogin: isLoginRef,
      isInitialized: isInitializedRef,
    })
    mockUseSupabaseUser.mockReturnValue({ value: { id: 'user-id', email: 'test@example.com' } })
    mockFetchUserData.mockImplementationOnce(async () => {
      isLoginRef.value = true
    })

    const to = {
      path: '/dashboard',
      fullPath: '/dashboard',
      query: {},
      meta: { groups: ['protected'] },
    }

    await middleware(to as never, {} as never)

    expect(mockFetchUserData).toHaveBeenCalledTimes(1)
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })
})
