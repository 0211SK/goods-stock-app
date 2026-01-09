import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SettingsPage from '../../../app/pages/settings/index.vue'

// PageTitleのモック
vi.mock('../../../app/components/common/PageTitle.vue', () => ({
    default: { name: 'PageTitle', template: '<div>設定</div>' }
}))


describe('SettingsMenuPage', () => {
    let wrapper: any

    beforeEach(() => {
        wrapper = mount(SettingsPage, {
            global: {
                components: {
                    NuxtLink: { template: '<a><slot /></a>' }
                }
            }
        })
    })

    it('タイトルが表示される', () => {
        expect(wrapper.text()).toContain('設定')
    })

    it('作品管理メニューが表示される', () => {
        expect(wrapper.text()).toContain('作品管理')
        expect(wrapper.text()).toContain('作品の登録・編集・削除')
    })

    it('種類管理メニューが表示される', () => {
        expect(wrapper.text()).toContain('種類管理')
        expect(wrapper.text()).toContain('グッズ種類の登録・編集・削除')
    })

    it('NuxtLinkが2つ表示される', () => {
        const links = wrapper.findAllComponents({ name: 'NuxtLink' })
        expect(links.length).toBe(2)
    })
})
