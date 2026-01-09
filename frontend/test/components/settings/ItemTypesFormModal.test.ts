import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ItemTypesFormModal from '../../../app/components/settings/ItemTypesFormModal.vue'

describe('ItemTypesFormModal.vue', () => {
    const defaultProps = {
        show: true,
        name: '',
        isEditing: false,
        loading: false,
    }

    beforeEach(() => {
        // 各テスト前のクリーンアップ
    })

    it('showがtrueの場合にモーダルが表示される', () => {
        const wrapper = mount(ItemTypesFormModal, {
            props: { ...defaultProps, show: true },
        })

        expect(wrapper.find('.modal-overlay').exists()).toBe(true)
        expect(wrapper.find('.modal-content').exists()).toBe(true)
    })

    it('showがfalseの場合にモーダルが表示されない', () => {
        const wrapper = mount(ItemTypesFormModal, {
            props: { ...defaultProps, show: false },
        })

        expect(wrapper.find('.modal-overlay').exists()).toBe(false)
    })

    it('isEditingがfalseの場合「種類を登録」と表示される', () => {
        const wrapper = mount(ItemTypesFormModal, {
            props: { ...defaultProps, isEditing: false },
        })

        expect(wrapper.find('h2').text()).toBe('種類を登録')
    })

    it('isEditingがtrueの場合「種類を編集」と表示される', () => {
        const wrapper = mount(ItemTypesFormModal, {
            props: { ...defaultProps, isEditing: true },
        })

        expect(wrapper.find('h2').text()).toBe('種類を編集')
    })

    it('name propが入力フィールドに反映される', () => {
        const wrapper = mount(ItemTypesFormModal, {
            props: { ...defaultProps, name: 'テスト種類' },
        })

        const input = wrapper.find('input#name')
        expect((input.element as HTMLInputElement).value).toBe('テスト種類')
    })

    it('入力フィールドの変更でupdate:nameイベントが発火する', async () => {
        const wrapper = mount(ItemTypesFormModal, {
            props: defaultProps,
        })

        const input = wrapper.find('input#name')
        await input.setValue('新しい種類')

        expect(wrapper.emitted('update:name')).toBeTruthy()
        expect(wrapper.emitted('update:name')?.[0]).toEqual(['新しい種類'])
    })

    it('フォームのsubmitでsubmitイベントが発火する', async () => {
        const wrapper = mount(ItemTypesFormModal, {
            props: defaultProps,
        })

        const form = wrapper.find('form')
        await form.trigger('submit.prevent')

        expect(wrapper.emitted('submit')).toBeTruthy()
        expect(wrapper.emitted('submit')?.length).toBe(1)
    })

    it('キャンセルボタンのクリックでcloseイベントが発火する', async () => {
        const wrapper = mount(ItemTypesFormModal, {
            props: defaultProps,
        })

        const cancelButton = wrapper.find('.btn-cancel')
        await cancelButton.trigger('click')

        expect(wrapper.emitted('close')).toBeTruthy()
        expect(wrapper.emitted('close')?.length).toBe(1)
    })

    it('オーバーレイのクリックでcloseイベントが発火する', async () => {
        const wrapper = mount(ItemTypesFormModal, {
            props: defaultProps,
        })

        const overlay = wrapper.find('.modal-overlay')
        await overlay.trigger('click')

        expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('モーダルコンテンツのクリックでcloseイベントが発火しない', async () => {
        const wrapper = mount(ItemTypesFormModal, {
            props: defaultProps,
        })

        const content = wrapper.find('.modal-content')
        await content.trigger('click')

        expect(wrapper.emitted('close')).toBeFalsy()
    })

    it('loadingがtrueの場合、キャンセルボタンが無効化される', () => {
        const wrapper = mount(ItemTypesFormModal, {
            props: { ...defaultProps, loading: true },
        })

        const cancelButton = wrapper.find('.btn-cancel')
        expect((cancelButton.element as HTMLButtonElement).disabled).toBe(true)
    })

    it('loadingがtrueの場合、submitボタンが無効化される', () => {
        const wrapper = mount(ItemTypesFormModal, {
            props: { ...defaultProps, loading: true },
        })

        const submitButton = wrapper.find('.btn-submit')
        expect((submitButton.element as HTMLButtonElement).disabled).toBe(true)
    })

    it('loadingがtrueの場合、submitボタンのテキストが「処理中...」になる', () => {
        const wrapper = mount(ItemTypesFormModal, {
            props: { ...defaultProps, loading: true },
        })

        const submitButton = wrapper.find('.btn-submit')
        expect(submitButton.text()).toBe('処理中...')
    })

    it('isEditingがfalseの場合、submitボタンのテキストが「登録」になる', () => {
        const wrapper = mount(ItemTypesFormModal, {
            props: { ...defaultProps, isEditing: false, loading: false },
        })

        const submitButton = wrapper.find('.btn-submit')
        expect(submitButton.text()).toBe('登録')
    })

    it('isEditingがtrueの場合、submitボタンのテキストが「更新」になる', () => {
        const wrapper = mount(ItemTypesFormModal, {
            props: { ...defaultProps, isEditing: true, loading: false },
        })

        const submitButton = wrapper.find('.btn-submit')
        expect(submitButton.text()).toBe('更新')
    })

    it('入力フィールドにplaceholderが設定されている', () => {
        const wrapper = mount(ItemTypesFormModal, {
            props: defaultProps,
        })

        const input = wrapper.find('input#name')
        expect(input.attributes('placeholder')).toBe('種類名を入力')
    })

    it('入力フィールドがrequired属性を持つ', () => {
        const wrapper = mount(ItemTypesFormModal, {
            props: defaultProps,
        })

        const input = wrapper.find('input#name')
        expect(input.attributes('required')).toBeDefined()
    })

    it('labelとinputが正しく関連付けられている', () => {
        const wrapper = mount(ItemTypesFormModal, {
            props: defaultProps,
        })

        const label = wrapper.find('label[for="name"]')
        const input = wrapper.find('input#name')

        expect(label.exists()).toBe(true)
        expect(input.exists()).toBe(true)
        expect(label.text()).toBe('種類名 *')
    })
})
