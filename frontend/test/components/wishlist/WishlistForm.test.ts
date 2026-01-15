import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import WishlistForm from '../../../app/components/wishlist/WishlistForm.vue'
import type { WishlistFormData } from '../../../app/components/wishlist/WishlistForm.vue'

// useImageUploadをモック
const mockUploadImage = vi.fn().mockResolvedValue('/uploads/test.jpg')
const mockDeleteImage = vi.fn().mockResolvedValue(undefined)
const mockValidateImageFile = vi.fn().mockReturnValue(null)
const mockGetImageUrl = vi.fn((path) => `http://localhost:8080${path}`)

vi.mock('../../../app/composables/useImageUpload', () => ({
    useImageUpload: () => ({
        uploadImage: mockUploadImage,
        deleteImage: mockDeleteImage,
        validateImageFile: mockValidateImageFile,
        getImageUrl: mockGetImageUrl,
        loading: { value: false },
        error: { value: null },
    }),
}))

describe('WishlistForm.vue', () => {
    const mockWorks = [
        { id: 1, name: 'アイドルマスター' },
        { id: 2, name: 'ラブライブ!' },
    ]

    const mockItemTypes = [
        { id: 1, name: 'フィギュア' },
        { id: 2, name: 'ぬいぐるみ' },
    ]

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('基本レンダリング', () => {
        it('正しくレンダリングされる', () => {
            const wrapper = mount(WishlistForm, {
                props: {
                    works: mockWorks,
                    itemTypes: mockItemTypes,
                },
            })

            expect(wrapper.find('form').exists()).toBe(true)
            expect(wrapper.findAll('select')).toHaveLength(2) // 作品と種類
            expect(wrapper.find('input[maxlength="255"]').exists()).toBe(true) // グッズ名
            expect(wrapper.findAll('input[type="number"]')).toHaveLength(2) // 個数と価格
            expect(wrapper.find('input[type="date"]').exists()).toBe(true) // 発売日
            expect(wrapper.find('textarea').exists()).toBe(true) // メモ
        })

        it('作品と種類の選択肢が正しく表示される', () => {
            const wrapper = mount(WishlistForm, {
                props: {
                    works: mockWorks,
                    itemTypes: mockItemTypes,
                },
            })

            const workSelect = wrapper.findAll('select')[0]
            const typeSelect = wrapper.findAll('select')[1]

            // 作品の選択肢（+「選択してください」）
            expect(workSelect.findAll('option')).toHaveLength(mockWorks.length + 1)
            expect(workSelect.html()).toContain('アイドルマスター')
            expect(workSelect.html()).toContain('ラブライブ!')

            // 種類の選択肢（+「選択してください」）
            expect(typeSelect.findAll('option')).toHaveLength(mockItemTypes.length + 1)
            expect(typeSelect.html()).toContain('フィギュア')
            expect(typeSelect.html()).toContain('ぬいぐるみ')
        })
    })

    describe('初期データ', () => {
        it('初期データが正しく設定される', async () => {
            const initialData: Partial<WishlistFormData> = {
                workId: 1,
                itemTypeId: 2,
                goodsName: 'テストグッズ',
                quantity: 3,
                expectedUnitPrice: 5000,
                releaseDate: '2024-03-15',
                memo: 'テストメモ',
            }

            const wrapper = mount(WishlistForm, {
                props: {
                    works: mockWorks,
                    itemTypes: mockItemTypes,
                    initialData,
                },
            })

            await nextTick()

            const workSelect = wrapper.findAll('select')[0]
            const typeSelect = wrapper.findAll('select')[1]
            const goodsNameInput = wrapper.find('input[maxlength="255"]')
            const quantityInput = wrapper.findAll('input[type="number"]')[0]
            const priceInput = wrapper.findAll('input[type="number"]')[1]
            const dateInput = wrapper.find('input[type="date"]')
            const memoTextarea = wrapper.find('textarea')

            expect((workSelect.element as HTMLSelectElement).value).toBe('1')
            expect((typeSelect.element as HTMLSelectElement).value).toBe('2')
            expect((goodsNameInput.element as HTMLInputElement).value).toBe('テストグッズ')
            expect((quantityInput.element as HTMLInputElement).value).toBe('3')
            expect((priceInput.element as HTMLInputElement).value).toBe('5000')
            expect((dateInput.element as HTMLInputElement).value).toBe('2024-03-15')
            expect((memoTextarea.element as HTMLTextAreaElement).value).toBe('テストメモ')
        })

        it('初期データが画像URLを含む場合、画像プレビューが表示される', async () => {
            const initialData: Partial<WishlistFormData> = {
                workId: 1,
                itemTypeId: 1,
                goodsName: 'テストグッズ',
                quantity: 1,
                expectedUnitPrice: 1000,
                imageUrl: '/uploads/test.jpg',
            }

            const wrapper = mount(WishlistForm, {
                props: {
                    works: mockWorks,
                    itemTypes: mockItemTypes,
                    initialData,
                },
            })

            await nextTick()

            expect(wrapper.find('.image-preview').exists()).toBe(true)
            expect(wrapper.find('.image-preview img').exists()).toBe(true)
            expect(wrapper.find('.image-preview img').attributes('src')).toBe('http://localhost:8080/uploads/test.jpg')
        })

        it('初期データの変更を監視してフォームが更新される', async () => {
            const wrapper = mount(WishlistForm, {
                props: {
                    works: mockWorks,
                    itemTypes: mockItemTypes,
                    initialData: {
                        workId: 1,
                        itemTypeId: 1,
                        goodsName: '最初のグッズ',
                        quantity: 1,
                        expectedUnitPrice: 1000,
                    },
                },
            })

            await nextTick()

            // initialDataを変更
            await wrapper.setProps({
                initialData: {
                    workId: 2,
                    itemTypeId: 2,
                    goodsName: '新しいグッズ',
                    quantity: 5,
                    expectedUnitPrice: 3000,
                },
            })

            await nextTick()

            const goodsNameInput = wrapper.find('input[maxlength="255"]')
            const quantityInput = wrapper.findAll('input[type="number"]')[0]

            expect((goodsNameInput.element as HTMLInputElement).value).toBe('新しいグッズ')
            expect((quantityInput.element as HTMLInputElement).value).toBe('5')
        })
    })

    describe('フォーム送信', () => {
        it('フォーム送信時にsubmitイベントが発火する', async () => {
            const wrapper = mount(WishlistForm, {
                props: {
                    works: mockWorks,
                    itemTypes: mockItemTypes,
                },
            })

            // フォームに値を入力
            const workSelect = wrapper.findAll('select')[0]
            const typeSelect = wrapper.findAll('select')[1]
            const goodsNameInput = wrapper.find('input[maxlength="255"]')
            const quantityInput = wrapper.findAll('input[type="number"]')[0]
            const priceInput = wrapper.findAll('input[type="number"]')[1]
            const dateInput = wrapper.find('input[type="date"]')

            await workSelect.setValue('1')
            await typeSelect.setValue('2')
            await goodsNameInput.setValue('新しいグッズ')
            await quantityInput.setValue('2')
            await priceInput.setValue('3000')
            await dateInput.setValue('2024-06-20')

            await nextTick()

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
                    expectedUnitPrice: 3000,
                    releaseDate: '2024-06-20',
                    imageUrl: null,
                    memo: null,
                },
            ])
        })

        it('メモを含むフォーム送信が正しく動作する', async () => {
            const wrapper = mount(WishlistForm, {
                props: {
                    works: mockWorks,
                    itemTypes: mockItemTypes,
                },
            })

            const workSelect = wrapper.findAll('select')[0]
            const typeSelect = wrapper.findAll('select')[1]
            const goodsNameInput = wrapper.find('input[maxlength="255"]')
            const quantityInput = wrapper.findAll('input[type="number"]')[0]
            const priceInput = wrapper.findAll('input[type="number"]')[1]
            const memoTextarea = wrapper.find('textarea')

            await workSelect.setValue('1')
            await typeSelect.setValue('1')
            await goodsNameInput.setValue('テストグッズ')
            await quantityInput.setValue('1')
            await priceInput.setValue('2500')
            await memoTextarea.setValue('予約済み')

            await nextTick()
            await wrapper.find('form').trigger('submit.prevent')

            expect(wrapper.emitted('submit')?.[0]).toEqual([
                {
                    workId: 1,
                    itemTypeId: 1,
                    goodsName: 'テストグッズ',
                    quantity: 1,
                    expectedUnitPrice: 2500,
                    releaseDate: null,
                    imageUrl: null,
                    memo: '予約済み',
                },
            ])
        })
    })

    describe('キャンセル処理', () => {
        it('キャンセルボタンクリック時にcancelイベントが発火する', async () => {
            const wrapper = mount(WishlistForm, {
                props: {
                    works: mockWorks,
                    itemTypes: mockItemTypes,
                },
            })

            const cancelButton = wrapper.findAll('button').find(btn => btn.text() === 'キャンセル')
            await cancelButton?.trigger('click')

            expect(wrapper.emitted('cancel')).toBeTruthy()
        })
    })

    describe('エラー表示', () => {
        it('エラーメッセージが表示される', () => {
            const errorMessage = 'テストエラーメッセージ'
            const wrapper = mount(WishlistForm, {
                props: {
                    works: mockWorks,
                    itemTypes: mockItemTypes,
                    errorMessage,
                },
            })

            expect(wrapper.find('.error-message').exists()).toBe(true)
            expect(wrapper.find('.error-message').text()).toBe(errorMessage)
        })

        it('エラーメッセージがない場合は表示されない', () => {
            const wrapper = mount(WishlistForm, {
                props: {
                    works: mockWorks,
                    itemTypes: mockItemTypes,
                },
            })

            expect(wrapper.find('.error-message').exists()).toBe(false)
        })
    })

    describe('送信ボタン', () => {
        it('submitting状態のときに送信ボタンが無効になる', () => {
            const wrapper = mount(WishlistForm, {
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
            const wrapper = mount(WishlistForm, {
                props: {
                    works: mockWorks,
                    itemTypes: mockItemTypes,
                    submitLabel: '更新する',
                },
            })

            const submitButton = wrapper.findAll('button').find(btn => btn.text() === '更新する')
            expect(submitButton).toBeDefined()
        })

        it('デフォルトのsubmitLabelは「登録する」', () => {
            const wrapper = mount(WishlistForm, {
                props: {
                    works: mockWorks,
                    itemTypes: mockItemTypes,
                },
            })

            const submitButton = wrapper.findAll('button').find(btn => btn.text() === '登録する')
            expect(submitButton).toBeDefined()
        })
    })

    describe('画像アップロード', () => {
        it('画像がない場合はファイル入力が表示される', () => {
            const wrapper = mount(WishlistForm, {
                props: {
                    works: mockWorks,
                    itemTypes: mockItemTypes,
                },
            })

            expect(wrapper.find('input[type="file"]').exists()).toBe(true)
            expect(wrapper.find('.image-preview').exists()).toBe(false)
        })

        it('画像がある場合はプレビューと削除ボタンが表示される', async () => {
            const wrapper = mount(WishlistForm, {
                props: {
                    works: mockWorks,
                    itemTypes: mockItemTypes,
                    initialData: {
                        imageUrl: '/uploads/test.jpg',
                    },
                },
            })

            await nextTick()

            expect(wrapper.find('.image-preview').exists()).toBe(true)
            expect(wrapper.find('.image-preview img').exists()).toBe(true)
            expect(wrapper.find('.btn-remove').exists()).toBe(true)
            expect(wrapper.find('input[type="file"]').exists()).toBe(false)
        })

        it('画像がある場合は削除ボタンが表示される', async () => {
            const wrapper = mount(WishlistForm, {
                props: {
                    works: mockWorks,
                    itemTypes: mockItemTypes,
                    initialData: {
                        workId: 1,
                        itemTypeId: 1,
                        goodsName: 'テスト',
                        quantity: 1,
                        expectedUnitPrice: 1000,
                        imageUrl: '/uploads/test.jpg',
                    },
                },
            })

            await nextTick()

            const removeButton = wrapper.find('.btn-remove')
            expect(removeButton.exists()).toBe(true)
        })
    })

    describe('バリデーション', () => {
        it('必須項目が設定されている', () => {
            const wrapper = mount(WishlistForm, {
                props: {
                    works: mockWorks,
                    itemTypes: mockItemTypes,
                },
            })

            const workSelect = wrapper.findAll('select')[0]
            const typeSelect = wrapper.findAll('select')[1]
            const goodsNameInput = wrapper.find('input[maxlength="255"]')
            const quantityInput = wrapper.findAll('input[type="number"]')[0]
            const priceInput = wrapper.findAll('input[type="number"]')[1]

            expect((workSelect.element as HTMLSelectElement).required).toBe(true)
            expect((typeSelect.element as HTMLSelectElement).required).toBe(true)
            expect((goodsNameInput.element as HTMLInputElement).required).toBe(true)
            expect((quantityInput.element as HTMLInputElement).required).toBe(true)
            expect((priceInput.element as HTMLInputElement).required).toBe(true)
        })

        it('数値入力の最小値が設定されている', () => {
            const wrapper = mount(WishlistForm, {
                props: {
                    works: mockWorks,
                    itemTypes: mockItemTypes,
                },
            })

            const quantityInput = wrapper.findAll('input[type="number"]')[0]
            const priceInput = wrapper.findAll('input[type="number"]')[1]

            expect((quantityInput.element as HTMLInputElement).min).toBe('0')
            expect((priceInput.element as HTMLInputElement).min).toBe('0')
        })

        it('グッズ名の最大文字数が設定されている', () => {
            const wrapper = mount(WishlistForm, {
                props: {
                    works: mockWorks,
                    itemTypes: mockItemTypes,
                },
            })

            const goodsNameInput = wrapper.find('input[maxlength="255"]')
            expect((goodsNameInput.element as HTMLInputElement).maxLength).toBe(255)
        })

        it('メモの最大文字数が設定されている', () => {
            const wrapper = mount(WishlistForm, {
                props: {
                    works: mockWorks,
                    itemTypes: mockItemTypes,
                },
            })

            const memoTextarea = wrapper.find('textarea')
            expect((memoTextarea.element as HTMLTextAreaElement).maxLength).toBe(1000)
        })
    })
})
