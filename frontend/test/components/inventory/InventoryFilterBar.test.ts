import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import InventoryFilterBar from '../../../app/components/inventory/InventoryFilterBar.vue'
import type { InventoryQuery } from '../../../app/types/inventory'

// useItemTypesをモック
const mockFetchItemTypes = vi.fn()
vi.mock('../../../app/composables/useItemTypes', () => ({
    useItemTypes: () => ({
        items: ref([
            { id: 1, name: 'フィギュア' },
            { id: 2, name: 'グッズ' },
            { id: 3, name: 'ぬいぐるみ' },
        ]),
        loading: ref(false),
        error: ref(null),
        fetchList: mockFetchItemTypes,
    }),
}))

describe('InventoryFilterBar.vue', () => {
    const defaultFilters: InventoryQuery = {
        itemTypeId: null,
        keyword: null,
        sort: 'purchaseDateDesc',
        page: 1,
        size: 20,
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('正しくレンダリングされる', () => {
        const wrapper = mount(InventoryFilterBar, {
            props: {
                filters: defaultFilters,
            },
        })

        expect(wrapper.find('.filterbar').exists()).toBe(true)
        expect(wrapper.findAll('select')).toHaveLength(2) // 種類とソート
    })

    it('種類の選択肢が正しく表示される', () => {
        const wrapper = mount(InventoryFilterBar, {
            props: {
                filters: defaultFilters,
            },
        })

        const typeSelect = wrapper.findAll('select')[0]
        const options = typeSelect.findAll('option')

        // 「種類：すべて」 + 3つのアイテムタイプ
        expect(options).toHaveLength(4)
        expect(options[0].text()).toBe('種類：すべて')
        expect(options[1].text()).toBe('フィギュア')
        expect(options[2].text()).toBe('グッズ')
        expect(options[3].text()).toBe('ぬいぐるみ')
    })

    it('ソートの選択肢が正しく表示される', () => {
        const wrapper = mount(InventoryFilterBar, {
            props: {
                filters: defaultFilters,
            },
        })

        const sortSelect = wrapper.findAll('select')[1]
        const options = sortSelect.findAll('option')

        expect(options).toHaveLength(4)
        expect(options[0].text()).toBe('購入日（新しい順）')
        expect(options[1].text()).toBe('購入日（古い順）')
        expect(options[2].text()).toBe('登録日（新しい順）')
        expect(options[3].text()).toBe('登録日（古い順）')
    })

    it('workNameが表示される', () => {
        const wrapper = mount(InventoryFilterBar, {
            props: {
                filters: defaultFilters,
                workName: 'テスト作品',
            },
        })

        expect(wrapper.find('.work-title').exists()).toBe(true)
        expect(wrapper.find('.work-title').text()).toBe('テスト作品')
    })

    it('workNameがnullの場合は表示されない', () => {
        const wrapper = mount(InventoryFilterBar, {
            props: {
                filters: defaultFilters,
                workName: null,
            },
        })

        expect(wrapper.find('.work-title').exists()).toBe(false)
    })

    it('種類変更時にupdate:filtersイベントが発火する', async () => {
        const wrapper = mount(InventoryFilterBar, {
            props: {
                filters: defaultFilters,
            },
        })

        const typeSelect = wrapper.findAll('select')[0]
        await typeSelect.setValue('2')

        expect(wrapper.emitted('update:filters')).toBeTruthy()
        expect(wrapper.emitted('update:filters')?.[0]).toEqual([
            { itemTypeId: 2 },
        ])
    })

    it('種類を「すべて」に変更時にitemTypeIdがnullになる', async () => {
        const wrapper = mount(InventoryFilterBar, {
            props: {
                filters: { ...defaultFilters, itemTypeId: 2 },
            },
        })

        const typeSelect = wrapper.findAll('select')[0]
        await typeSelect.setValue('')

        expect(wrapper.emitted('update:filters')).toBeTruthy()
        expect(wrapper.emitted('update:filters')?.[0]).toEqual([
            { itemTypeId: null },
        ])
    })

    it('ソート変更時にupdate:filtersイベントが発火する', async () => {
        const wrapper = mount(InventoryFilterBar, {
            props: {
                filters: defaultFilters,
            },
        })

        const sortSelect = wrapper.findAll('select')[1]
        await sortSelect.setValue('purchaseDateAsc')

        expect(wrapper.emitted('update:filters')).toBeTruthy()
        expect(wrapper.emitted('update:filters')?.[0]).toEqual([
            { sort: 'purchaseDateAsc' },
        ])
    })

    it('フィルターの初期値が正しく設定される', () => {
        const filters: InventoryQuery = {
            itemTypeId: 2,
            keyword: 'テスト',
            sort: 'createdAtDesc',
            page: 1,
            size: 20,
        }

        const wrapper = mount(InventoryFilterBar, {
            props: {
                filters,
            },
        })

        const typeSelect = wrapper.findAll('select')[0]
        const sortSelect = wrapper.findAll('select')[1]

        expect((typeSelect.element as HTMLSelectElement).value).toBe('2')
        expect((sortSelect.element as HTMLSelectElement).value).toBe('createdAtDesc')
    })

    it('マウント時にfetchItemTypesが呼ばれる', () => {
        mount(InventoryFilterBar, {
            props: {
                filters: defaultFilters,
            },
        })

        expect(mockFetchItemTypes).toHaveBeenCalledTimes(1)
        expect(mockFetchItemTypes).toHaveBeenCalledWith({ page: 1, size: 200 })
    })

    it('itemTypeIdがnullの場合は空文字が選択される', () => {
        const wrapper = mount(InventoryFilterBar, {
            props: {
                filters: { ...defaultFilters, itemTypeId: null },
            },
        })

        const typeSelect = wrapper.findAll('select')[0]
        expect((typeSelect.element as HTMLSelectElement).value).toBe('')
    })

    it('sortがundefinedの場合はデフォルト値が選択される', () => {
        const wrapper = mount(InventoryFilterBar, {
            props: {
                filters: { ...defaultFilters, sort: undefined },
            },
        })

        const sortSelect = wrapper.findAll('select')[1]
        expect((sortSelect.element as HTMLSelectElement).value).toBe('purchaseDateDesc')
    })
})
