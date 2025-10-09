// Common test helpers and mocks
import { vi } from 'vitest'

// Mock i18n composables used in middleware/components
vi.mock('@nuxtjs/i18n', () => ({
  useLocalePath: () => (path: string) => path,
}))

// Minimal mock for Nuxt app when needed
export function mockNuxtApp(overrides: Partial<any> = {}) {
  const nuxtApp: any = {
    $gtag: { event: vi.fn(), consent: vi.fn(), initialize: vi.fn() },
    $supabase: { client: {} },
    ...overrides,
  }
  return nuxtApp
}
