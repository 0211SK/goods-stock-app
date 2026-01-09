import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import InventoryList from '../../../app/components/inventory/InventoryList.vue'
import type { InventoryQuery } from '../../../app/types/inventory'

// モック関数を定義
const mockFetchList = vi.fn()
const mockRouterPush = vi.fn()
const mockGetImageUrl = vi.fn((path: string) => `http://localhost:8080${path}`)

// useOwnedItemsをモック
const mockItems = ref<any[]>([])
const mockLoading = ref(false)
const mockError = ref<string | null>(null)

vi.mock('../../../app/composables/useOwnedItems', () => ({
    useOwnedItems: () => ({
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

// useRouterをモック (#imports)
vi.mock('#imports', () => ({
    useRouter: () => ({
        push: mockRouterPush,
    }),
}))

describe('InventoryList.vue', () => {
    const defaultFilters: InventoryQuery = {
        itemTypeId: null,
        keyword: null,
        sort: 'purchaseDateDesc',
        page: 1,
        size: 20,
    }

    beforeEach(() => {
        vi.clearAllMocks()
        mockItems.value = []
        mockLoading.value = false
        mockError.value = null
    })

    it('loading状態が正しく表示される', () => {
        mockLoading.value = true

        const wrapper = mount(InventoryList, {
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

        const wrapper = mount(InventoryList, {
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

        const wrapper = mount(InventoryList, {
            props: {
                workId: null,
                filters: defaultFilters,
            },
        })

        expect(wrapper.find('.no-data').exists()).toBe(true)
        expect(wrapper.find('.no-data').text()).toBe('データなし')
        expect(wrapper.find('.grid').exists()).toBe(false)
    })

    it('アイテムリストが正しく表示される', async () => {
        mockItems.value = [
            { id: 1, goodsName: 'グッズ1', imageUrl: '/uploads/img1.jpg', workId: 1 },
            { id: 2, goodsName: 'グッズ2', imageUrl: null, workId: 1 },
        ]

        const wrapper = mount(InventoryList, {
            props: {
                workId: null,
                filters: defaultFilters,
            },
        })

        await nextTick()

        expect(wrapper.find('.grid').exists()).toBe(true)
        expect(wrapper.findAll('.card')).toHaveLength(2)
        expect(wrapper.findAll('.goods-name')[0].text()).toBe('グッズ1')
        expect(wrapper.findAll('.goods-name')[1].text()).toBe('グッズ2')
    })

    it('画像URLがある場合は画像が表示される', async () => {
        mockItems.value = [
            { id: 1, goodsName: 'グッズ1', imageUrl: '/uploads/img1.jpg', workId: 1 },
        ]

        const wrapper = mount(InventoryList, {
            props: {
                workId: null,
                filters: defaultFilters,
            },
        })

        await nextTick()

        expect(wrapper.find('.thumb img').exists()).toBe(true)
        expect(wrapper.find('.thumb img').attributes('src')).toBe('http://localhost:8080/uploads/img1.jpg')
        expect(wrapper.find('.no-image').exists()).toBe(false)
    })

    it('画像URLがない場合は「画像なし」が表示される', async () => {
        mockItems.value = [
            { id: 1, goodsName: 'グッズ1', imageUrl: null, workId: 1 },
        ]

        const wrapper = mount(InventoryList, {
            props: {
                workId: null,
                filters: defaultFilters,
            },
        })

        await nextTick()

        expect(wrapper.find('.thumb img').exists()).toBe(false)
        expect(wrapper.find('.no-image').exists()).toBe(true)
        expect(wrapper.find('.no-image').text()).toBe('画像なし')
    })

    it('goodsNameがnullの場合はnameが表示される', async () => {
        mockItems.value = [
            { id: 1, name: '代替名', goodsName: null, workId: 1 },
        ]

        const wrapper = mount(InventoryList, {
            props: {
                workId: null,
                filters: defaultFilters,
            },
        })

        await nextTick()

        expect(wrapper.find('.goods-name').text()).toBe('代替名')
    })

    it('goodsNameとnameがnullの場合は「無名のグッズ」が表示される', async () => {
        mockItems.value = [
            { id: 1, goodsName: null, name: null, workId: 1 },
        ]

        const wrapper = mount(InventoryList, {
            props: {
                workId: null,
                filters: defaultFilters,
            },
        })

        await nextTick()

        expect(wrapper.find('.goods-name').text()).toBe('無名のグッズ')
    })

    it('アイテムクリック時にworkIdがnullの場合は/inventory/:idに遷移する', async () => {
        mockItems.value = [
            { id: 123, goodsName: 'グッズ1', workId: null },
        ]

        const wrapper = mount(InventoryList, {
            props: {
                workId: null,
                filters: defaultFilters,
            },
        })

        await nextTick()

        await wrapper.find('.card').trigger('click')

        expect(mockRouterPush).toHaveBeenCalledWith('/inventory/123')
    })

    it('アイテムクリック時にworkIdがある場合は/inventory/:workId/:idに遷移する', async () => {
        mockItems.value = [
            { id: 123, goodsName: 'グッズ1', workId: 456 },
        ]

        const wrapper = mount(InventoryList, {
            props: {
                workId: 456,
                filters: defaultFilters,
            },
        })

        await nextTick()

        await wrapper.find('.card').trigger('click')

        expect(mockRouterPush).toHaveBeenCalledWith('/inventory/456/123')
    })

    it('propsのworkIdがある場合はそれを優先して使用する', async () => {
        mockItems.value = [
            { id: 123, goodsName: 'グッズ1', workId: 999 },
        ]

        const wrapper = mount(InventoryList, {
            props: {
                workId: 456,
                filters: defaultFilters,
            },
        })

        await nextTick()

        await wrapper.find('.card').trigger('click')

        // propsのworkId (456) が優先される
        expect(mockRouterPush).toHaveBeenCalledWith('/inventory/456/123')
    })

    it('マウント時にfetchListが呼ばれる', () => {
        mount(InventoryList, {
            props: {
                workId: null,
                filters: defaultFilters,
            },
        })

        expect(mockFetchList).toHaveBeenCalled()
        expect(mockFetchList).toHaveBeenCalledWith({
            workId: undefined,
            itemTypeId: undefined,
            keyword: undefined,
            page: 1,
            size: 20,
            sort: 'purchaseDateDesc',
        })
    })

    it('フィルター変更時にfetchListが再度呼ばれる', async () => {
        const wrapper = mount(InventoryList, {
            props: {
                workId: null,
                filters: defaultFilters,
            },
        })

        expect(mockFetchList).toHaveBeenCalledTimes(1)

        // フィルターを変更
        await wrapper.setProps({
            filters: { ...defaultFilters, itemTypeId: 2 },
        })

        await nextTick()

        expect(mockFetchList).toHaveBeenCalledTimes(2)
        expect(mockFetchList).toHaveBeenLastCalledWith({
            workId: undefined,
            itemTypeId: 2,
            keyword: undefined,
            page: 1,
            size: 20,
            sort: 'purchaseDateDesc',
        })
    })

    it('workIdとフィルターが組み合わされて正しくクエリが作成される', () => {
        mount(InventoryList, {
            props: {
                workId: 123,
                filters: {
                    itemTypeId: 2,
                    keyword: 'テスト',
                    sort: 'createdAtDesc',
                    page: 2,
                    size: 50,
                },
            },
        })

        expect(mockFetchList).toHaveBeenCalledWith({
            workId: 123,
            itemTypeId: 2,
            keyword: 'テスト',
            page: 2,
            size: 50,
            sort: 'createdAtDesc',
        })
    })
})
