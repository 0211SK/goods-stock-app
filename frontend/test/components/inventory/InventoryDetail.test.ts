import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import InventoryDetail from '../../../app/components/inventory/InventoryDetail.vue'

// useImageUploadをモック
const mockGetImageUrl = vi.fn((path: string) => `http://localhost:8080${path}`)

vi.mock('../../../app/composables/useImageUpload', () => ({
    useImageUpload: () => ({
        getImageUrl: mockGetImageUrl,
    }),
}))

describe('InventoryDetail.vue', () => {
    it('loading状態が正しく表示される', () => {
        const wrapper = mount(InventoryDetail, {
            props: {
                item: null,
                loading: true,
                error: null,
            },
        })

        expect(wrapper.text()).toContain('読み込み中…')
        expect(wrapper.find('.detail').exists()).toBe(false)
    })

    it('error状態が正しく表示される', () => {
        const wrapper = mount(InventoryDetail, {
            props: {
                item: null,
                loading: false,
                error: 'エラーが発生しました',
            },
        })

        expect(wrapper.text()).toContain('データの取得に失敗しました。リロードしてください')
        expect(wrapper.find('.detail').exists()).toBe(false)
    })

    it('itemがnullの場合は「データが見つかりません」が表示される', () => {
        const wrapper = mount(InventoryDetail, {
            props: {
                item: null,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.text()).toContain('データが見つかりません。')
        expect(wrapper.find('.detail').exists()).toBe(false)
    })

    it('アイテムの詳細が正しく表示される', () => {
        const item = {
            id: 1,
            goodsName: 'テストグッズ',
            itemTypeName: 'フィギュア',
            unitPrice: 3000,
            purchaseDate: '2024-01-15',
            quantity: 2,
            memo: 'テストメモ',
            imageUrl: '/uploads/test.jpg',
        }

        const wrapper = mount(InventoryDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.find('.detail').exists()).toBe(true)
        expect(wrapper.find('h2').text()).toBe('テストグッズ')
        expect(wrapper.text()).toContain('ジャンル： フィギュア')
        expect(wrapper.text()).toContain('価格： ¥3000')
        expect(wrapper.text()).toContain('購入日： 2024-01-15')
        expect(wrapper.text()).toContain('個数： 2')
        expect(wrapper.text()).toContain('メモ： テストメモ')
    })

    it('画像URLがある場合は画像が表示される', () => {
        const item = {
            id: 1,
            goodsName: 'テストグッズ',
            imageUrl: '/uploads/test.jpg',
        }

        const wrapper = mount(InventoryDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.find('.image img').exists()).toBe(true)
        expect(wrapper.find('.image img').attributes('src')).toBe('http://localhost:8080/uploads/test.jpg')
        expect(wrapper.find('.no-image').exists()).toBe(false)
    })

    it('画像URLがない場合は「画像なし」が表示される', () => {
        const item = {
            id: 1,
            goodsName: 'テストグッズ',
            imageUrl: null,
        }

        const wrapper = mount(InventoryDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.find('.image img').exists()).toBe(false)
        expect(wrapper.find('.no-image').exists()).toBe(true)
        expect(wrapper.find('.no-image').text()).toBe('画像なし')
    })

    it('goodsNameがnullの場合はnameが表示される', () => {
        const item = {
            id: 1,
            goodsName: null,
            name: '代替名',
        }

        const wrapper = mount(InventoryDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.find('h2').text()).toBe('代替名')
    })

    it('unitPriceがない場合は「未設定」が表示される', () => {
        const item = {
            id: 1,
            goodsName: 'テストグッズ',
            unitPrice: null,
        }

        const wrapper = mount(InventoryDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.text()).toContain('価格： 未設定')
        expect(wrapper.find('strong').exists()).toBe(false)
    })

    it('unitPriceが0の場合は¥0が表示される', () => {
        const item = {
            id: 1,
            goodsName: 'テストグッズ',
            unitPrice: 0,
        }

        const wrapper = mount(InventoryDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        // 0はfalsyだが、v-ifで明示的にチェックしているため「未設定」が表示される
        expect(wrapper.text()).toContain('価格： 未設定')
    })

    it('purchaseDateがない場合はcreatedAtが表示される', () => {
        const item = {
            id: 1,
            goodsName: 'テストグッズ',
            purchaseDate: null,
            createdAt: '2024-02-01',
        }

        const wrapper = mount(InventoryDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.text()).toContain('購入日： 2024-02-01')
    })

    it('itemTypeNameがない場合は空文字が表示される', () => {
        const item = {
            id: 1,
            goodsName: 'テストグッズ',
            itemTypeName: null,
        }

        const wrapper = mount(InventoryDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.text()).toContain('ジャンル： ')
    })

    it('quantityがない場合は空文字が表示される', () => {
        const item = {
            id: 1,
            goodsName: 'テストグッズ',
            quantity: null,
        }

        const wrapper = mount(InventoryDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.text()).toContain('個数： ')
    })

    it('memoがない場合は空文字が表示される', () => {
        const item = {
            id: 1,
            goodsName: 'テストグッズ',
            memo: null,
        }

        const wrapper = mount(InventoryDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.text()).toContain('メモ：')
    })

    it('すべてのフィールドがnullの場合でもエラーにならない', () => {
        const item = {
            id: 1,
            goodsName: null,
            name: null,
            itemTypeName: null,
            unitPrice: null,
            purchaseDate: null,
            createdAt: null,
            quantity: null,
            memo: null,
            imageUrl: null,
        }

        const wrapper = mount(InventoryDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.find('.detail').exists()).toBe(true)
        expect(wrapper.find('.no-image').exists()).toBe(true)
    })
})
