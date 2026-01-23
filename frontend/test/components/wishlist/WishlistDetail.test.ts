import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WishlistDetail from '../../../app/components/wishlist/WishlistDetail.vue'

// useImageUploadをモック
const mockGetImageUrl = vi.fn((path: string) => `http://localhost:8080${path}`)

vi.mock('../../../app/composables/useImageUpload', () => ({
    default: () => ({
        getImageUrl: mockGetImageUrl,
    }),
}))

describe('WishlistDetail.vue', () => {
    it('loading状態が正しく表示される', () => {
        const wrapper = mount(WishlistDetail, {
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
        const wrapper = mount(WishlistDetail, {
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
        const wrapper = mount(WishlistDetail, {
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
            name: '作品名',
            itemTypeName: 'フィギュア',
            expectedUnitPrice: 5000,
            releaseDate: '2024-03-15',
            quantity: 2,
            memo: 'テストメモ',
            imageUrl: '/uploads/test.jpg',
        }

        const wrapper = mount(WishlistDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.find('.detail').exists()).toBe(true)
        expect(wrapper.find('h2').text()).toBe('テストグッズ')
        expect(wrapper.text()).toContain('ジャンル： フィギュア')
        expect(wrapper.text()).toContain('商品価格： ¥5000')
        expect(wrapper.text()).toContain('購入予定価格： ¥10000')
        expect(wrapper.text()).toContain('発売日： 2024-03-15')
        expect(wrapper.text()).toContain('購入予定個数： 2')
        expect(wrapper.text()).toContain('メモ： テストメモ')
    })

    it('goodsNameがない場合はnameが表示される', () => {
        const item = {
            id: 1,
            goodsName: null,
            name: '作品名',
        }

        const wrapper = mount(WishlistDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.find('h2').text()).toBe('作品名')
    })

    it('goodsNameがある場合はgoodsNameが優先される', () => {
        const item = {
            id: 1,
            goodsName: 'グッズ名',
            name: '作品名',
        }

        const wrapper = mount(WishlistDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.find('h2').text()).toBe('グッズ名')
    })

    it('画像URLがある場合は画像が表示される', () => {
        const item = {
            id: 1,
            goodsName: 'テストグッズ',
            imageUrl: '/uploads/test.jpg',
        }

        const wrapper = mount(WishlistDetail, {
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

        const wrapper = mount(WishlistDetail, {
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

    it('expectedUnitPriceがない場合は「未設定」が表示される', () => {
        const item = {
            id: 1,
            goodsName: 'テストグッズ',
            expectedUnitPrice: null,
            quantity: 2,
        }

        const wrapper = mount(WishlistDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.text()).toContain('商品価格： 未設定')
        expect(wrapper.text()).toContain('購入予定価格： 未設定')
    })

    it('quantityがない場合は購入予定価格が「未設定」になる', () => {
        const item = {
            id: 1,
            goodsName: 'テストグッズ',
            expectedUnitPrice: 5000,
            quantity: null,
        }

        const wrapper = mount(WishlistDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.text()).toContain('商品価格： ¥5000')
        expect(wrapper.text()).toContain('購入予定価格： 未設定')
    })

    it('購入予定価格が正しく計算される', () => {
        const item = {
            id: 1,
            goodsName: 'テストグッズ',
            expectedUnitPrice: 3000,
            quantity: 4,
        }

        const wrapper = mount(WishlistDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.text()).toContain('商品価格： ¥3000')
        expect(wrapper.text()).toContain('購入予定価格： ¥12000')
    })

    it('itemTypeNameがない場合は空文字が表示される', () => {
        const item = {
            id: 1,
            goodsName: 'テストグッズ',
            itemTypeName: null,
        }

        const wrapper = mount(WishlistDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.text()).toContain('ジャンル：')
    })

    it('releaseDateがない場合は空文字が表示される', () => {
        const item = {
            id: 1,
            goodsName: 'テストグッズ',
            releaseDate: null,
        }

        const wrapper = mount(WishlistDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.text()).toContain('発売日：')
    })

    it('quantityがない場合は空文字が表示される', () => {
        const item = {
            id: 1,
            goodsName: 'テストグッズ',
            quantity: null,
        }

        const wrapper = mount(WishlistDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.text()).toContain('購入予定個数：')
    })

    it('memoがない場合は空文字が表示される', () => {
        const item = {
            id: 1,
            goodsName: 'テストグッズ',
            memo: null,
        }

        const wrapper = mount(WishlistDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.text()).toContain('メモ：')
    })

    it('すべてのフィールドが設定されている場合、すべて正しく表示される', () => {
        const item = {
            id: 1,
            goodsName: 'テストグッズ',
            name: '作品名',
            itemTypeName: 'ぬいぐるみ',
            expectedUnitPrice: 2500,
            releaseDate: '2024-06-20',
            quantity: 3,
            memo: '予約済み',
            imageUrl: '/uploads/goods.jpg',
        }

        const wrapper = mount(WishlistDetail, {
            props: {
                item,
                loading: false,
                error: null,
            },
        })

        expect(wrapper.find('h2').text()).toBe('テストグッズ')
        expect(wrapper.text()).toContain('ジャンル： ぬいぐるみ')
        expect(wrapper.text()).toContain('商品価格： ¥2500')
        expect(wrapper.text()).toContain('購入予定価格： ¥7500')
        expect(wrapper.text()).toContain('発売日： 2024-06-20')
        expect(wrapper.text()).toContain('購入予定個数： 3')
        expect(wrapper.text()).toContain('メモ： 予約済み')
        expect(wrapper.find('.image img').attributes('src')).toBe('http://localhost:8080/uploads/goods.jpg')
    })
})
