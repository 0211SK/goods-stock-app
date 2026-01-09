import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import WishlistList from '../../../app/components/wishlist/WishlistList.vue'

// モック関数を定義
const mockFetchList = vi.fn()
const mockRouterPush = vi.fn()
const mockGetImageUrl = vi.fn((path: string) => `http://localhost:8080${path}`)

// useWishlistItemsをモック
const mockItems = ref<any[]>([])
const mockLoading = ref(false)
const mockError = ref<string | null>(null)

vi.mock('../../../app/composables/useWishlistItems', () => ({
    useWishlistItems: () => ({
        items: mockItems,
        loading: mockLoading,
        error: mockError,
        fetchList: mockFetchList,
    }),
}))

// useImageUploadをモック
vi.mock('../../../app/composables/useImageUpload', () => ({
    useImageUpload: () => ({
        getImageUrl: mockGetImageUrl,
    }),
}))

// useRouterをモック
vi.mock('#imports', () => ({
    useRouter: () => ({
        push: mockRouterPush,
    }),
}))

describe('WishlistList.vue', () => {
    const defaultFilters = {
        workId: undefined,
        itemTypeId: undefined,
        keyword: undefined,
        sort: 'releaseDateDesc',
        page: 1,
        size: 20,
    }

    beforeEach(() => {
        vi.clearAllMocks()
        mockItems.value = []
        mockLoading.value = false
        mockError.value = null
    })

    describe('状態表示', () => {
        it('loading状態が正しく表示される', () => {
            mockLoading.value = true

            const wrapper = mount(WishlistList, {
                props: {
                    workId: null,
                    filters: defaultFilters,
                },
            })

            expect(wrapper.find('.loading').exists()).toBe(true)
            expect(wrapper.find('.loading').text()).toBe('読み込み中…')
            expect(wrapper.find('.grid').exists()).toBe(false)
        })

        it('error状態が正しく表示される', () => {
            mockLoading.value = false
            mockError.value = 'エラーが発生しました'

            const wrapper = mount(WishlistList, {
                props: {
                    workId: null,
                    filters: defaultFilters,
                },
            })

            expect(wrapper.find('.error').exists()).toBe(true)
            expect(wrapper.find('.error').text()).toBe('取得に失敗しました')
            expect(wrapper.find('.grid').exists()).toBe(false)
        })

        it('データなし状態が正しく表示される', () => {
            mockLoading.value = false
            mockError.value = null
            mockItems.value = []

            const wrapper = mount(WishlistList, {
                props: {
                    workId: null,
                    filters: defaultFilters,
                },
            })

            expect(wrapper.find('.no-data').exists()).toBe(true)
            expect(wrapper.find('.no-data').text()).toBe('データなし')
            expect(wrapper.find('.grid').exists()).toBe(false)
        })
    })

    describe('アイテム一覧の表示', () => {
        const mockWishlistItems = [
            {
                id: 1,
                workId: 1,
                goodsName: 'テストグッズ1',
                releaseDate: '2024-03-15',
                imageUrl: '/uploads/test1.jpg',
            },
            {
                id: 2,
                workId: 1,
                goodsName: 'テストグッズ2',
                releaseDate: '2024-04-20',
                imageUrl: null,
            },
            {
                id: 3,
                workId: 1,
                goodsName: null,
                releaseDate: null,
                imageUrl: '/uploads/test3.jpg',
            },
        ]

        it('アイテム一覧が正しく表示される', () => {
            mockItems.value = mockWishlistItems

            const wrapper = mount(WishlistList, {
                props: {
                    workId: 1,
                    filters: defaultFilters,
                },
            })

            expect(wrapper.find('.grid').exists()).toBe(true)
            const cards = wrapper.findAll('.card')
            expect(cards).toHaveLength(3)
        })

        it('グッズ名が正しく表示される', () => {
            mockItems.value = mockWishlistItems

            const wrapper = mount(WishlistList, {
                props: {
                    workId: 1,
                    filters: defaultFilters,
                },
            })

            const cards = wrapper.findAll('.card')
            expect(cards[0].find('.goods-name').text()).toBe('テストグッズ1')
            expect(cards[1].find('.goods-name').text()).toBe('テストグッズ2')
            expect(cards[2].find('.goods-name').text()).toBe('無名のグッズ')
        })

        it('発売日が正しく表示される', () => {
            mockItems.value = mockWishlistItems

            const wrapper = mount(WishlistList, {
                props: {
                    workId: 1,
                    filters: defaultFilters,
                },
            })

            const cards = wrapper.findAll('.card')
            expect(cards[0].find('.release-date').text()).toBe('発売日：2024-03-15')
            expect(cards[1].find('.release-date').text()).toBe('発売日：2024-04-20')
            expect(cards[2].find('.release-date').text()).toBe('発売日：')
        })

        it('画像URLがある場合は画像が表示される', () => {
            mockItems.value = mockWishlistItems

            const wrapper = mount(WishlistList, {
                props: {
                    workId: 1,
                    filters: defaultFilters,
                },
            })

            const cards = wrapper.findAll('.card')
            expect(cards[0].find('.thumb img').exists()).toBe(true)
            expect(cards[0].find('.thumb img').attributes('src')).toBe('http://localhost:8080/uploads/test1.jpg')
            expect(cards[0].find('.no-image').exists()).toBe(false)
        })

        it('画像URLがない場合は「画像なし」が表示される', () => {
            mockItems.value = mockWishlistItems

            const wrapper = mount(WishlistList, {
                props: {
                    workId: 1,
                    filters: defaultFilters,
                },
            })

            const cards = wrapper.findAll('.card')
            expect(cards[1].find('.thumb img').exists()).toBe(false)
            expect(cards[1].find('.no-image').exists()).toBe(true)
            expect(cards[1].find('.no-image').text()).toBe('画像なし')
        })
    })

    describe('アイテムクリック', () => {
        const mockWishlistItems = [
            {
                id: 1,
                workId: 1,
                goodsName: 'テストグッズ1',
                releaseDate: '2024-03-15',
            },
            {
                id: 2,
                workId: 2,
                goodsName: 'テストグッズ2',
                releaseDate: '2024-04-20',
            },
        ]

        it('カードクリックでルーターpushが呼ばれる（workIdがpropsで指定）', async () => {
            mockItems.value = mockWishlistItems

            const wrapper = mount(WishlistList, {
                props: {
                    workId: 1,
                    filters: defaultFilters,
                },
            })

            const cards = wrapper.findAll('.card')
            await cards[0].trigger('click')

            expect(mockRouterPush).toHaveBeenCalledWith('/wishlist/1/1')
        })

        it('カードクリックでルーターpushが呼ばれる（workIdがitemから取得）', async () => {
            mockItems.value = mockWishlistItems

            const wrapper = mount(WishlistList, {
                props: {
                    workId: null,
                    filters: defaultFilters,
                },
            })

            const cards = wrapper.findAll('.card')
            await cards[1].trigger('click')

            expect(mockRouterPush).toHaveBeenCalledWith('/wishlist/2/2')
        })

        it('props.workIdが優先される', async () => {
            mockItems.value = mockWishlistItems

            const wrapper = mount(WishlistList, {
                props: {
                    workId: 5,
                    filters: defaultFilters,
                },
            })

            const cards = wrapper.findAll('.card')
            await cards[0].trigger('click')

            expect(mockRouterPush).toHaveBeenCalledWith('/wishlist/5/1')
        })
    })

    describe('fetchList呼び出し', () => {
        it('マウント時にfetchListが呼ばれる', async () => {
            mount(WishlistList, {
                props: {
                    workId: null,
                    filters: defaultFilters,
                },
            })

            await nextTick()

            expect(mockFetchList).toHaveBeenCalled()
        })

        it('workIdが指定されている場合、queryに含まれる', async () => {
            mount(WishlistList, {
                props: {
                    workId: 3,
                    filters: defaultFilters,
                },
            })

            await nextTick()

            expect(mockFetchList).toHaveBeenCalledWith(
                expect.objectContaining({
                    workId: 3,
                })
            )
        })

        it('filtersがqueryに反映される', async () => {
            mount(WishlistList, {
                props: {
                    workId: null,
                    filters: {
                        itemTypeId: 2,
                        keyword: 'test',
                        sort: 'createdAtAsc',
                        page: 3,
                        size: 50,
                    },
                },
            })

            await nextTick()

            expect(mockFetchList).toHaveBeenCalledWith(
                expect.objectContaining({
                    itemTypeId: 2,
                    keyword: 'test',
                    sort: 'createdAtAsc',
                    page: 3,
                    size: 50,
                })
            )
        })

        it('workIdがpropsとfilters両方にある場合、propsが優先される', async () => {
            mount(WishlistList, {
                props: {
                    workId: 5,
                    filters: {
                        workId: 3,
                        sort: 'releaseDateDesc',
                        page: 1,
                        size: 20,
                    },
                },
            })

            await nextTick()

            expect(mockFetchList).toHaveBeenCalledWith(
                expect.objectContaining({
                    workId: 5,
                })
            )
        })

        it('デフォルト値が設定される', async () => {
            mount(WishlistList, {
                props: {
                    workId: null,
                    filters: {},
                },
            })

            await nextTick()

            expect(mockFetchList).toHaveBeenCalledWith(
                expect.objectContaining({
                    page: 1,
                    size: 20,
                    sort: 'releaseDateDesc',
                })
            )
        })

        it('filtersの変更でfetchListが再度呼ばれる', async () => {
            const wrapper = mount(WishlistList, {
                props: {
                    workId: null,
                    filters: defaultFilters,
                },
            })

            await nextTick()
            mockFetchList.mockClear()

            await wrapper.setProps({
                filters: {
                    ...defaultFilters,
                    itemTypeId: 2,
                },
            })

            await nextTick()

            expect(mockFetchList).toHaveBeenCalledWith(
                expect.objectContaining({
                    itemTypeId: 2,
                })
            )
        })
    })
})
