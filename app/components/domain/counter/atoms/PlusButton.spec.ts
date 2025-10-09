// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Stub Nuxt app APIs used by @nuxt/icon
vi.mock('nuxt/app', () => ({ useNuxtApp: () => ({ vueApp: { config: { globalProperties: {} } } }) }))
import PlusButton from './PlusButton.vue'

// shallow mount: BaseAtomsButton をスタブ

describe('PlusButton', () => {
  it('click emits via prop function', async () => {
    const onClick = vi.fn()
    const wrapper = mount(PlusButton, {
      global: { stubs: { BaseAtomsButton: { template: '<button @click="$attrs[\'click-function\']()"><slot /></button>' }, Icon: true, NuxtIcon: true } },
      props: { clickFunction: onClick },
    })
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
