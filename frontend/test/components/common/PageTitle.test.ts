import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PageTitle from '../../../app/components/common/PageTitle.vue'

describe('PageTitle.vue', () => {
    it('propsで渡されたタイトルが表示される', () => {
        const wrapper = mount(PageTitle, {
            props: {
                title: 'テストタイトル',
            },
        })

        expect(wrapper.text()).toBe('テストタイトル')
    })

    it('h1要素として表示される', () => {
        const wrapper = mount(PageTitle, {
            props: {
                title: 'テストタイトル',
            },
        })

        const h1 = wrapper.find('h1')
        expect(h1.exists()).toBe(true)
        expect(h1.text()).toBe('テストタイトル')
    })

    it('page-titleクラスが適用される', () => {
        const wrapper = mount(PageTitle, {
            props: {
                title: 'テストタイトル',
            },
        })

        const h1 = wrapper.find('h1')
        expect(h1.classes()).toContain('page-title')
    })

    it('異なるタイトルでも正しく表示される', () => {
        const wrapper = mount(PageTitle, {
            props: {
                title: '在庫一覧',
            },
        })

        expect(wrapper.find('h1').text()).toBe('在庫一覧')
    })

    it('空文字列のタイトルでも表示される', () => {
        const wrapper = mount(PageTitle, {
            props: {
                title: '',
            },
        })

        expect(wrapper.find('h1').exists()).toBe(true)
        expect(wrapper.find('h1').text()).toBe('')
    })

    it('日本語タイトルが正しく表示される', () => {
        const wrapper = mount(PageTitle, {
            props: {
                title: '欲しいものリスト',
            },
        })

        expect(wrapper.text()).toBe('欲しいものリスト')
    })
})
