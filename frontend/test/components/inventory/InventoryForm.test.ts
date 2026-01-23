import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import InventoryForm from '../../../app/components/inventory/InventoryForm.vue'
import type { InventoryFormData } from '../../../app/components/inventory/InventoryForm.vue'

// useImageUploadをdefaultエクスポートでモック
vi.mock('../../../app/composables/useImageUpload', () => ({
    default: () => ({
        uploadImage: vi.fn().mockResolvedValue('/uploads/test.jpg'),
        deleteImage: vi.fn().mockResolvedValue(undefined),
        validateImageFile: vi.fn().mockReturnValue(null),
        getImageUrl: vi.fn((path) => `http://localhost:8080${path}`),
        loading: { value: false },
        error: { value: null },
    }),
}))

describe('InventoryForm.vue', () => {
    const mockWorks = [
        { id: 1, name: '作品A' },
        { id: 2, name: '作品B' },
    ]

    const mockItemTypes = [
        { id: 1, name: 'フィギュア' },
        { id: 2, name: 'グッズ' },
    ]

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('正しくレンダリングされる', () => {
        const wrapper = mount(InventoryForm, {
            props: {
                works: mockWorks,
                itemTypes: mockItemTypes,
            },
        })

        expect(wrapper.find('form').exists()).toBe(true)
        expect(wrapper.findAll('select')).toHaveLength(2) // 作品と種類
        expect(wrapper.find('input[type="number"]').exists()).toBe(true)
        expect(wrapper.find('input[type="date"]').exists()).toBe(true)
        expect(wrapper.find('textarea').exists()).toBe(true)
    })

    it('作品と種類の選択肢が正しく表示される', () => {
        const wrapper = mount(InventoryForm, {
            props: {
                works: mockWorks,
                itemTypes: mockItemTypes,
            },
        })

        const workSelect = wrapper.findAll('select')[0]
        const typeSelect = wrapper.findAll('select')[1]

        // 作品の選択肢（+「選択してください」）
        expect(workSelect.findAll('option')).toHaveLength(mockWorks.length + 1)
        expect(workSelect.html()).toContain('作品A')
        expect(workSelect.html()).toContain('作品B')

        // 種類の選択肢（+「選択してください」）
        expect(typeSelect.findAll('option')).toHaveLength(mockItemTypes.length + 1)
        expect(typeSelect.html()).toContain('フィギュア')
        expect(typeSelect.html()).toContain('グッズ')
    })

    it('初期データが正しく設定される', async () => {
        const initialData: Partial<InventoryFormData> = {
            workId: 1,
            itemTypeId: 2,
            goodsName: 'テストグッズ',
            quantity: 3,
            unitPrice: 1500,
            purchaseDate: '2024-01-01',
            memo: 'テストメモ',
        }

        const wrapper = mount(InventoryForm, {
            props: {
                works: mockWorks,
                itemTypes: mockItemTypes,
                initialData,
            },
        })

        await wrapper.vm.$nextTick()

        const workSelect = wrapper.findAll('select')[0]
        const typeSelect = wrapper.findAll('select')[1]
        const goodsNameInput = wrapper.find('input[maxlength="255"]')
        const quantityInput = wrapper.find('input[type="number"][min="1"]')
        const priceInput = wrapper.find('input[type="number"][min="0"]')
        const dateInput = wrapper.find('input[type="date"]')
        const memoTextarea = wrapper.find('textarea')

        expect((workSelect.element as HTMLSelectElement).value).toBe('1')
        expect((typeSelect.element as HTMLSelectElement).value).toBe('2')
        expect((goodsNameInput.element as HTMLInputElement).value).toBe('テストグッズ')
        expect((quantityInput.element as HTMLInputElement).value).toBe('3')
        expect((priceInput.element as HTMLInputElement).value).toBe('1500')
        expect((dateInput.element as HTMLInputElement).value).toBe('2024-01-01')
        expect((memoTextarea.element as HTMLTextAreaElement).value).toBe('テストメモ')
    })

    it('フォーム送信時にsubmitイベントが発火する', async () => {
        const wrapper = mount(InventoryForm, {
            props: {
                works: mockWorks,
                itemTypes: mockItemTypes,
            },
        })

        // フォームに値を入力
        const workSelect = wrapper.findAll('select')[0]
        const typeSelect = wrapper.findAll('select')[1]
        const goodsNameInput = wrapper.find('input[maxlength="255"]')
        const quantityInput = wrapper.find('input[type="number"][min="1"]')
        const priceInput = wrapper.find('input[type="number"][min="0"]')
        const dateInput = wrapper.find('input[type="date"]')

        // selectはv-model.numberなので文字列として設定
        await workSelect.setValue('1')
        await typeSelect.setValue('2')
        await goodsNameInput.setValue('新しいグッズ')
        await quantityInput.setValue('2')
        await priceInput.setValue('3000')
        await dateInput.setValue('2024-12-25')

        // DOM更新を待つ
        await wrapper.vm.$nextTick()

        // フォーム送信
        await wrapper.find('form').trigger('submit.prevent')

        // submitイベントが発火したことを確認
        expect(wrapper.emitted('submit')).toBeTruthy()
        expect(wrapper.emitted('submit')?.[0]).toEqual([
            {
                workId: 1,
                itemTypeId: 2,
                goodsName: '新しいグッズ',
                quantity: 2,
                unitPrice: 3000,
                purchaseDate: '2024-12-25',
                imageUrl: null,
                memo: null,
            },
        ])
    })

    it('キャンセルボタンクリック時にcancelイベントが発火する', async () => {
        const wrapper = mount(InventoryForm, {
            props: {
                works: mockWorks,
                itemTypes: mockItemTypes,
            },
        })

        const cancelButton = wrapper.findAll('button').find(btn => btn.text() === 'キャンセル')
        await cancelButton?.trigger('click')

        expect(wrapper.emitted('cancel')).toBeTruthy()
    })

    it('エラーメッセージが表示される', () => {
        const errorMessage = 'テストエラーメッセージ'
        const wrapper = mount(InventoryForm, {
            props: {
                works: mockWorks,
                itemTypes: mockItemTypes,
                errorMessage,
            },
        })

        expect(wrapper.find('.error-message').exists()).toBe(true)
        expect(wrapper.find('.error-message').text()).toBe(errorMessage)
    })

    it('submitting状態のときに送信ボタンが無効になる', async () => {
        const wrapper = mount(InventoryForm, {
            props: {
                works: mockWorks,
                itemTypes: mockItemTypes,
                submitting: true,
            },
        })

        const submitButton = wrapper.findAll('button').find(btn => btn.text().includes('登録'))
        expect((submitButton?.element as HTMLButtonElement).disabled).toBe(true)
    })

    it('submitLabelプロパティでボタンラベルが変更される', () => {
        const wrapper = mount(InventoryForm, {
            props: {
                works: mockWorks,
                itemTypes: mockItemTypes,
                submitLabel: '更新する',
            },
        })

        const submitButton = wrapper.findAll('button').find(btn => btn.text() === '更新する')
        expect(submitButton?.exists()).toBe(true)
    })

    it('画像URLがある場合、プレビューが表示される', async () => {
        const initialData: Partial<InventoryFormData> = {
            imageUrl: '/uploads/test-image.jpg',
            workId: 1,
            itemTypeId: 1,
            goodsName: 'test',
            quantity: 1,
            unitPrice: 100,
            purchaseDate: '2024-01-01',
        }

        const wrapper = mount(InventoryForm, {
            props: {
                works: mockWorks,
                itemTypes: mockItemTypes,
                initialData,
            },
        })

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.image-preview').exists()).toBe(true)
        expect(wrapper.find('.image-preview img').exists()).toBe(true)
        expect(wrapper.find('.btn-remove').exists()).toBe(true)
    })

    it('メモの最大文字数が1000文字に制限される', () => {
        const wrapper = mount(InventoryForm, {
            props: {
                works: mockWorks,
                itemTypes: mockItemTypes,
            },
        })

        const memoTextarea = wrapper.find('textarea')
        expect(memoTextarea.attributes('maxlength')).toBe('1000')
    })

    it('グッズ名の最大文字数が255文字に制限される', () => {
        const wrapper = mount(InventoryForm, {
            props: {
                works: mockWorks,
                itemTypes: mockItemTypes,
            },
        })

        const goodsNameInput = wrapper.find('input[maxlength="255"]')
        expect(goodsNameInput.attributes('maxlength')).toBe('255')
    })

    it('個数は1以上の値のみ入力可能', () => {
        const wrapper = mount(InventoryForm, {
            props: {
                works: mockWorks,
                itemTypes: mockItemTypes,
            },
        })

        const quantityInput = wrapper.find('input[type="number"][min="1"]')
        expect(quantityInput.attributes('min')).toBe('1')
    })

    it('価格は0以上の値のみ入力可能', () => {
        const wrapper = mount(InventoryForm, {
            props: {
                works: mockWorks,
                itemTypes: mockItemTypes,
            },
        })

        const priceInput = wrapper.find('input[type="number"][min="0"]')
        expect(priceInput.attributes('min')).toBe('0')
    })
})
