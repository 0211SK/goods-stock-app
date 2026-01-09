import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import WorksFormModal from '../../../app/components/settings/WorksFormModal.vue'

describe('WorksFormModal.vue', () => {
    const defaultProps = {
        show: true,
        name: '',
        nameKana: '',
        memo: '',
        isEditing: false,
        loading: false,
    }

    beforeEach(() => {
        // 各テスト前のクリーンアップ
    })

    it('showがtrueの場合にモーダルが表示される', () => {
        const wrapper = mount(WorksFormModal, {
            props: { ...defaultProps, show: true },
        })

        expect(wrapper.find('.modal-overlay').exists()).toBe(true)
        expect(wrapper.find('.modal-content').exists()).toBe(true)
    })

    it('showがfalseの場合にモーダルが表示されない', () => {
        const wrapper = mount(WorksFormModal, {
            props: { ...defaultProps, show: false },
        })

        expect(wrapper.find('.modal-overlay').exists()).toBe(false)
    })

    it('isEditingがfalseの場合「作品を登録」と表示される', () => {
        const wrapper = mount(WorksFormModal, {
            props: { ...defaultProps, isEditing: false },
        })

        expect(wrapper.find('h2').text()).toBe('作品を登録')
    })

    it('isEditingがtrueの場合「作品を編集」と表示される', () => {
        const wrapper = mount(WorksFormModal, {
            props: { ...defaultProps, isEditing: true },
        })

        expect(wrapper.find('h2').text()).toBe('作品を編集')
    })

    it('name propが入力フィールドに反映される', () => {
        const wrapper = mount(WorksFormModal, {
            props: { ...defaultProps, name: 'テスト作品' },
        })

        const input = wrapper.find('input#name')
        expect((input.element as HTMLInputElement).value).toBe('テスト作品')
    })

    it('nameKana propが入力フィールドに反映される', () => {
        const wrapper = mount(WorksFormModal, {
            props: { ...defaultProps, nameKana: 'てすとさくひん' },
        })

        const input = wrapper.find('input#nameKana')
        expect((input.element as HTMLInputElement).value).toBe('てすとさくひん')
    })

    it('memo propがテキストエリアに反映される', () => {
        const wrapper = mount(WorksFormModal, {
            props: { ...defaultProps, memo: 'テストメモ' },
        })

        const textarea = wrapper.find('textarea#memo')
        expect((textarea.element as HTMLTextAreaElement).value).toBe('テストメモ')
    })

    it('name入力フィールドの変更でupdate:nameイベントが発火する', async () => {
        const wrapper = mount(WorksFormModal, {
            props: defaultProps,
        })

        const input = wrapper.find('input#name')
        await input.setValue('新しい作品')

        expect(wrapper.emitted('update:name')).toBeTruthy()
        expect(wrapper.emitted('update:name')?.[0]).toEqual(['新しい作品'])
    })

    it('nameKana入力フィールドの変更でupdate:nameKanaイベントが発火する', async () => {
        const wrapper = mount(WorksFormModal, {
            props: defaultProps,
        })

        const input = wrapper.find('input#nameKana')
        await input.setValue('あたらしいさくひん')

        expect(wrapper.emitted('update:nameKana')).toBeTruthy()
        expect(wrapper.emitted('update:nameKana')?.[0]).toEqual(['あたらしいさくひん'])
    })

    it('memoテキストエリアの変更でupdate:memoイベントが発火する', async () => {
        const wrapper = mount(WorksFormModal, {
            props: defaultProps,
        })

        const textarea = wrapper.find('textarea#memo')
        await textarea.setValue('新しいメモ')

        expect(wrapper.emitted('update:memo')).toBeTruthy()
        expect(wrapper.emitted('update:memo')?.[0]).toEqual(['新しいメモ'])
    })

    it('フォームのsubmitでsubmitイベントが発火する', async () => {
        const wrapper = mount(WorksFormModal, {
            props: defaultProps,
        })

        const form = wrapper.find('form')
        await form.trigger('submit.prevent')

        expect(wrapper.emitted('submit')).toBeTruthy()
        expect(wrapper.emitted('submit')?.length).toBe(1)
    })

    it('キャンセルボタンのクリックでcloseイベントが発火する', async () => {
        const wrapper = mount(WorksFormModal, {
            props: defaultProps,
        })

        const cancelButton = wrapper.find('.btn-cancel')
        await cancelButton.trigger('click')

        expect(wrapper.emitted('close')).toBeTruthy()
        expect(wrapper.emitted('close')?.length).toBe(1)
    })

    it('オーバーレイのクリックでcloseイベントが発火する', async () => {
        const wrapper = mount(WorksFormModal, {
            props: defaultProps,
        })

        const overlay = wrapper.find('.modal-overlay')
        await overlay.trigger('click')

        expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('モーダルコンテンツのクリックでcloseイベントが発火しない', async () => {
        const wrapper = mount(WorksFormModal, {
            props: defaultProps,
        })

        const content = wrapper.find('.modal-content')
        await content.trigger('click')

        expect(wrapper.emitted('close')).toBeFalsy()
    })

    it('loadingがtrueの場合、キャンセルボタンが無効化される', () => {
        const wrapper = mount(WorksFormModal, {
            props: { ...defaultProps, loading: true },
        })

        const cancelButton = wrapper.find('.btn-cancel')
        expect((cancelButton.element as HTMLButtonElement).disabled).toBe(true)
    })

    it('loadingがtrueの場合、submitボタンが無効化される', () => {
        const wrapper = mount(WorksFormModal, {
            props: { ...defaultProps, loading: true },
        })

        const submitButton = wrapper.find('.btn-submit')
        expect((submitButton.element as HTMLButtonElement).disabled).toBe(true)
    })

    it('loadingがtrueの場合、submitボタンのテキストが「処理中...」になる', () => {
        const wrapper = mount(WorksFormModal, {
            props: { ...defaultProps, loading: true },
        })

        const submitButton = wrapper.find('.btn-submit')
        expect(submitButton.text()).toBe('処理中...')
    })

    it('isEditingがfalseの場合、submitボタンのテキストが「登録」になる', () => {
        const wrapper = mount(WorksFormModal, {
            props: { ...defaultProps, isEditing: false, loading: false },
        })

        const submitButton = wrapper.find('.btn-submit')
        expect(submitButton.text()).toBe('登録')
    })

    it('isEditingがtrueの場合、submitボタンのテキストが「更新」になる', () => {
        const wrapper = mount(WorksFormModal, {
            props: { ...defaultProps, isEditing: true, loading: false },
        })

        const submitButton = wrapper.find('.btn-submit')
        expect(submitButton.text()).toBe('更新')
    })

    it('required属性が設定されている', () => {
        const wrapper = mount(WorksFormModal, {
            props: defaultProps,
        })

        const nameInput = wrapper.find('input#name')
        const nameKanaInput = wrapper.find('input#nameKana')
        const memoTextarea = wrapper.find('textarea#memo')

        expect((nameInput.element as HTMLInputElement).required).toBe(true)
        expect((nameKanaInput.element as HTMLInputElement).required).toBe(true)
        expect((memoTextarea.element as HTMLTextAreaElement).required).toBe(false)
    })

    it('プレースホルダーが正しく設定されている', () => {
        const wrapper = mount(WorksFormModal, {
            props: defaultProps,
        })

        const nameInput = wrapper.find('input#name')
        const nameKanaInput = wrapper.find('input#nameKana')
        const memoTextarea = wrapper.find('textarea#memo')

        expect((nameInput.element as HTMLInputElement).placeholder).toBe('作品名を入力')
        expect((nameKanaInput.element as HTMLInputElement).placeholder).toBe('よみがなを入力')
        expect((memoTextarea.element as HTMLTextAreaElement).placeholder).toBe('メモを入力（任意）')
    })
})
