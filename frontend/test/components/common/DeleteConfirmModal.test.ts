import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DeleteConfirmModal from '../../../app/components/common/DeleteConfirmModal.vue'

describe('DeleteConfirmModal.vue', () => {
    it('すべてのモーダルが非表示の場合は何も表示されない', () => {
        const wrapper = mount(DeleteConfirmModal, {
            props: {
                showDeleteModal: false,
                showSuccessModal: false,
                showErrorModal: false,
                deleting: false,
            },
        })

        expect(wrapper.find('.modal-overlay').exists()).toBe(false)
    })

    it('削除確認モーダルが表示される', () => {
        const wrapper = mount(DeleteConfirmModal, {
            props: {
                showDeleteModal: true,
                showSuccessModal: false,
                showErrorModal: false,
                deleting: false,
            },
        })

        expect(wrapper.find('.modal-overlay').exists()).toBe(true)
        expect(wrapper.find('.modal-message').text()).toBe('本当に削除しますか？')
        expect(wrapper.findAll('button')).toHaveLength(2)
    })

    it('削除確認モーダルのキャンセルボタンでcancelイベントが発火する', async () => {
        const wrapper = mount(DeleteConfirmModal, {
            props: {
                showDeleteModal: true,
                showSuccessModal: false,
                showErrorModal: false,
                deleting: false,
            },
        })

        const cancelButton = wrapper.find('.btn-cancel')
        await cancelButton.trigger('click')

        expect(wrapper.emitted('cancel')).toBeTruthy()
    })

    it('削除確認モーダルの削除ボタンでconfirmイベントが発火する', async () => {
        const wrapper = mount(DeleteConfirmModal, {
            props: {
                showDeleteModal: true,
                showSuccessModal: false,
                showErrorModal: false,
                deleting: false,
            },
        })

        const confirmButton = wrapper.find('.btn-confirm')
        await confirmButton.trigger('click')

        expect(wrapper.emitted('confirm')).toBeTruthy()
    })

    it('削除中はボタンが無効化される', () => {
        const wrapper = mount(DeleteConfirmModal, {
            props: {
                showDeleteModal: true,
                showSuccessModal: false,
                showErrorModal: false,
                deleting: true,
            },
        })

        const cancelButton = wrapper.find('.btn-cancel')
        const confirmButton = wrapper.find('.btn-confirm')

        expect((cancelButton.element as HTMLButtonElement).disabled).toBe(true)
        expect((confirmButton.element as HTMLButtonElement).disabled).toBe(true)
    })

    it('削除中は削除ボタンのテキストが「削除中...」になる', () => {
        const wrapper = mount(DeleteConfirmModal, {
            props: {
                showDeleteModal: true,
                showSuccessModal: false,
                showErrorModal: false,
                deleting: true,
            },
        })

        const confirmButton = wrapper.find('.btn-confirm')
        expect(confirmButton.text()).toBe('削除中...')
    })

    it('削除中でない場合は削除ボタンのテキストが「削除」になる', () => {
        const wrapper = mount(DeleteConfirmModal, {
            props: {
                showDeleteModal: true,
                showSuccessModal: false,
                showErrorModal: false,
                deleting: false,
            },
        })

        const confirmButton = wrapper.find('.btn-confirm')
        expect(confirmButton.text()).toBe('削除')
    })

    it('削除確認モーダルのオーバーレイクリックでcancelイベントが発火する', async () => {
        const wrapper = mount(DeleteConfirmModal, {
            props: {
                showDeleteModal: true,
                showSuccessModal: false,
                showErrorModal: false,
                deleting: false,
            },
        })

        const overlay = wrapper.find('.modal-overlay')
        await overlay.trigger('click')

        expect(wrapper.emitted('cancel')).toBeTruthy()
    })

    it('削除成功モーダルが表示される', () => {
        const wrapper = mount(DeleteConfirmModal, {
            props: {
                showDeleteModal: false,
                showSuccessModal: true,
                showErrorModal: false,
                deleting: false,
            },
        })

        expect(wrapper.find('.modal-overlay').exists()).toBe(true)
        expect(wrapper.find('.modal-message').text()).toBe('削除しました')
        expect(wrapper.find('.btn-success').exists()).toBe(true)
    })

    it('削除成功モーダルのOKボタンでclose-successイベントが発火する', async () => {
        const wrapper = mount(DeleteConfirmModal, {
            props: {
                showDeleteModal: false,
                showSuccessModal: true,
                showErrorModal: false,
                deleting: false,
            },
        })

        const okButton = wrapper.find('.btn-success')
        await okButton.trigger('click')

        expect(wrapper.emitted('close-success')).toBeTruthy()
    })

    it('削除成功モーダルのオーバーレイクリックでclose-successイベントが発火する', async () => {
        const wrapper = mount(DeleteConfirmModal, {
            props: {
                showDeleteModal: false,
                showSuccessModal: true,
                showErrorModal: false,
                deleting: false,
            },
        })

        const overlay = wrapper.find('.modal-overlay')
        await overlay.trigger('click')

        expect(wrapper.emitted('close-success')).toBeTruthy()
    })

    it('削除失敗モーダルが表示される', () => {
        const wrapper = mount(DeleteConfirmModal, {
            props: {
                showDeleteModal: false,
                showSuccessModal: false,
                showErrorModal: true,
                deleting: false,
            },
        })

        expect(wrapper.find('.modal-overlay').exists()).toBe(true)
        expect(wrapper.find('.modal-message').text()).toBe('削除に失敗しました')
        expect(wrapper.find('.btn-error').exists()).toBe(true)
    })

    it('カスタムエラーメッセージが表示される', () => {
        const wrapper = mount(DeleteConfirmModal, {
            props: {
                showDeleteModal: false,
                showSuccessModal: false,
                showErrorModal: true,
                deleting: false,
                errorMessage: 'カスタムエラーメッセージ',
            },
        })

        expect(wrapper.find('.modal-message').text()).toBe('カスタムエラーメッセージ')
    })

    it('削除失敗モーダルのOKボタンでclose-errorイベントが発火する', async () => {
        const wrapper = mount(DeleteConfirmModal, {
            props: {
                showDeleteModal: false,
                showSuccessModal: false,
                showErrorModal: true,
                deleting: false,
            },
        })

        const okButton = wrapper.find('.btn-error')
        await okButton.trigger('click')

        expect(wrapper.emitted('close-error')).toBeTruthy()
    })

    it('削除失敗モーダルのオーバーレイクリックでclose-errorイベントが発火する', async () => {
        const wrapper = mount(DeleteConfirmModal, {
            props: {
                showDeleteModal: false,
                showSuccessModal: false,
                showErrorModal: true,
                deleting: false,
            },
        })

        const overlay = wrapper.find('.modal-overlay')
        await overlay.trigger('click')

        expect(wrapper.emitted('close-error')).toBeTruthy()
    })

    it('複数のモーダルが同時にtrueの場合でも正しく動作する', () => {
        // 実際には同時に複数のモーダルが表示されることはないが、テストとして確認
        const wrapper = mount(DeleteConfirmModal, {
            props: {
                showDeleteModal: true,
                showSuccessModal: true,
                showErrorModal: true,
                deleting: false,
            },
        })

        // 3つのオーバーレイが表示される
        expect(wrapper.findAll('.modal-overlay')).toHaveLength(3)
    })

    it('削除確認モーダルのボタンが正しく配置されている', () => {
        const wrapper = mount(DeleteConfirmModal, {
            props: {
                showDeleteModal: true,
                showSuccessModal: false,
                showErrorModal: false,
                deleting: false,
            },
        })

        const buttons = wrapper.findAll('button')
        expect(buttons[0].classes()).toContain('btn-cancel')
        expect(buttons[0].text()).toBe('キャンセル')
        expect(buttons[1].classes()).toContain('btn-confirm')
        expect(buttons[1].text()).toBe('削除')
    })
})
