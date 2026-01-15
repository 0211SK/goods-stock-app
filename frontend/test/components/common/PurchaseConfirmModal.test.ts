import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import PurchaseConfirmModal from '../../../app/components/common/PurchaseConfirmModal.vue'

// モック関数を定義
const mockUploadImage = vi.fn()
const mockDeleteImage = vi.fn()
const mockValidateImageFile = vi.fn()
const mockGetImageUrl = vi.fn((path: string) => `http://localhost:8080${path}`)

// useImageUploadをモック
vi.mock('../../../app/composables/useImageUpload', () => ({
    useImageUpload: () => ({
        uploadImage: mockUploadImage,
        deleteImage: mockDeleteImage,
        validateImageFile: mockValidateImageFile,
        getImageUrl: mockGetImageUrl,
        loading: ref(false),
        error: ref(null),
    }),
}))

describe('PurchaseConfirmModal.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUploadImage.mockResolvedValue('/uploads/new-image.jpg')
        mockDeleteImage.mockResolvedValue(undefined)
        mockValidateImageFile.mockReturnValue(null)
    })

    it('すべてのモーダルが非表示の場合は何も表示されない', () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: false,
                showSuccessModal: false,
                showErrorModal: false,
            },
        })

        expect(wrapper.find('.modal-overlay').exists()).toBe(false)
    })

    it('購入確認モーダルが表示される', () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: true,
                showSuccessModal: false,
                showErrorModal: false,
            },
        })

        expect(wrapper.find('.modal-overlay').exists()).toBe(true)
        expect(wrapper.find('h3').text()).toBe('購入確認')
        expect(wrapper.text()).toContain('この商品を購入済みとして在庫に登録しますか？')
    })

    it('現在の画像が表示される', () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: true,
                showSuccessModal: false,
                showErrorModal: false,
                currentImageUrl: '/uploads/current.jpg',
            },
        })

        expect(wrapper.find('.current-image').exists()).toBe(true)
        expect(wrapper.find('.current-image img').attributes('src')).toBe('http://localhost:8080/uploads/current.jpg')
        expect(wrapper.text()).toContain('現在の画像:')
    })

    it('現在の画像がない場合は現在の画像セクションが表示されない', () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: true,
                showSuccessModal: false,
                showErrorModal: false,
                currentImageUrl: null,
            },
        })

        expect(wrapper.find('.current-image').exists()).toBe(false)
    })

    it('確認ボタンクリックでconfirmイベントが発火する', async () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: true,
                showSuccessModal: false,
                showErrorModal: false,
            },
        })

        const confirmButton = wrapper.find('.btn-confirm')
        expect(confirmButton.exists()).toBe(true)

        // ボタンのDOMエレメントを直接クリック
        await confirmButton.trigger('click')
        await flushPromises()
        await nextTick()

        expect(wrapper.emitted('confirm')).toBeTruthy()
        expect(wrapper.emitted('confirm')?.[0]).toEqual([null]) // 新しい画像がない場合はnull
    })

    it('キャンセルボタンクリックでcancelイベントが発火する', async () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: true,
                showSuccessModal: false,
                showErrorModal: false,
            },
        })

        const cancelButton = wrapper.find('.btn-cancel')
        expect(cancelButton.exists()).toBe(true)

        // ボタンのDOMエレメントを直接クリック
        await cancelButton.trigger('click')
        await flushPromises()
        await nextTick()

        expect(wrapper.emitted('cancel')).toBeTruthy()
    })

    it('purchasing状態の場合はボタンが無効化される', () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: true,
                showSuccessModal: false,
                showErrorModal: false,
                purchasing: true,
            },
        })

        const confirmButton = wrapper.findAll('button').find(btn => btn.text().includes('登録中'))
        const cancelButton = wrapper.findAll('button').find(btn => btn.text() === 'キャンセル')

        expect((confirmButton?.element as HTMLButtonElement).disabled).toBe(true)
        expect((cancelButton?.element as HTMLButtonElement).disabled).toBe(true)
    })

    it('purchasing中は確認ボタンのテキストが「登録中...」になる', () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: true,
                showSuccessModal: false,
                showErrorModal: false,
                purchasing: true,
            },
        })

        const confirmButton = wrapper.findAll('button').find(btn => btn.text().includes('登録中'))
        expect(confirmButton?.text()).toBe('登録中...')
    })

    it('購入成功モーダルが表示される', () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: false,
                showSuccessModal: true,
                showErrorModal: false,
            },
        })

        expect(wrapper.find('.modal-overlay').exists()).toBe(true)
        expect(wrapper.find('h3').text()).toBe('購入完了')
        expect(wrapper.text()).toContain('在庫として登録しました。欲しいものリストから削除されました。')
    })

    it('購入成功モーダルのOKボタンでclose-successイベントが発火する', async () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: false,
                showSuccessModal: true,
                showErrorModal: false,
            },
        })

        const okButton = wrapper.find('button')
        await okButton.trigger('click')

        expect(wrapper.emitted('close-success')).toBeTruthy()
    })

    it('購入成功モーダルのオーバーレイクリックでclose-successイベントが発火する', async () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: false,
                showSuccessModal: true,
                showErrorModal: false,
            },
        })

        const overlay = wrapper.find('.modal-overlay')
        await overlay.trigger('click')

        expect(wrapper.emitted('close-success')).toBeTruthy()
    })

    it('購入エラーモーダルが表示される', () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: false,
                showSuccessModal: false,
                showErrorModal: true,
                errorMessage: 'テストエラーメッセージ',
            },
        })

        expect(wrapper.find('.modal-overlay').exists()).toBe(true)
        expect(wrapper.find('h3').text()).toBe('エラー')
        expect(wrapper.text()).toContain('テストエラーメッセージ')
    })

    it('購入エラーモーダルのOKボタンでclose-errorイベントが発火する', async () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: false,
                showSuccessModal: false,
                showErrorModal: true,
            },
        })

        const okButton = wrapper.find('button')
        await okButton.trigger('click')

        expect(wrapper.emitted('close-error')).toBeTruthy()
    })

    it('購入エラーモーダルのオーバーレイクリックでclose-errorイベントが発火する', async () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: false,
                showSuccessModal: false,
                showErrorModal: true,
            },
        })

        const overlay = wrapper.find('.modal-overlay')
        await overlay.trigger('click')

        expect(wrapper.emitted('close-error')).toBeTruthy()
    })

    it('購入確認モーダルのオーバーレイクリックでキャンセルされる', async () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: true,
                showSuccessModal: false,
                showErrorModal: false,
            },
        })

        const overlay = wrapper.find('.modal-overlay')
        await overlay.trigger('click')

        expect(wrapper.emitted('cancel')).toBeTruthy()
    })

    it('画像アップロードセクションが表示される', () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: true,
                showSuccessModal: false,
                showErrorModal: false,
            },
        })

        expect(wrapper.find('.image-upload-section').exists()).toBe(true)
        expect(wrapper.find('input[type="file"]').exists()).toBe(true)
        expect(wrapper.text()).toContain('購入した商品の画像に更新してください')
    })

    it('ファイル入力のaccept属性が正しく設定されている', () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: true,
                showSuccessModal: false,
                showErrorModal: false,
            },
        })

        const fileInput = wrapper.find('input[type="file"]')
        expect(fileInput.attributes('accept')).toBe('image/*')
    })

    it('purchasing中はファイル入力が無効化される', () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: true,
                showSuccessModal: false,
                showErrorModal: false,
                purchasing: true,
            },
        })

        const fileInput = wrapper.find('input[type="file"]')
        expect((fileInput.element as HTMLInputElement).disabled).toBe(true)
    })

    it('モーダルが開かれるたびに新しい画像URLがリセットされる', async () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: false,
                showSuccessModal: false,
                showErrorModal: false,
            },
        })

        // モーダルを開く
        await wrapper.setProps({ showPurchaseModal: true })
        await nextTick()

        expect(wrapper.find('input[type="file"]').exists()).toBe(true)
        expect(wrapper.find('.image-preview').exists()).toBe(false)
    })

    it('デフォルトプロパティが正しく設定される', () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: true,
                showSuccessModal: false,
                showErrorModal: false,
            },
        })

        // errorMessage, purchasing, currentImageUrlのデフォルト値が適用されている
        expect(wrapper.props('errorMessage')).toBe('')
        expect(wrapper.props('purchasing')).toBe(false)
        expect(wrapper.props('currentImageUrl')).toBe(null)
    })

    it('確認ボタンとキャンセルボタンが正しい順序で表示される', () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: true,
                showSuccessModal: false,
                showErrorModal: false,
            },
        })

        const buttons = wrapper.findAll('.modal-actions button')
        expect(buttons[0].text()).toContain('購入済みにする')
        expect(buttons[1].text()).toBe('キャンセル')
    })

    it('modal-content--largeクラスが購入確認モーダルに適用される', () => {
        const wrapper = mount(PurchaseConfirmModal, {
            props: {
                showPurchaseModal: true,
                showSuccessModal: false,
                showErrorModal: false,
            },
        })

        const modalContent = wrapper.find('.modal-content')
        expect(modalContent.classes()).toContain('modal-content--large')
    })
})
