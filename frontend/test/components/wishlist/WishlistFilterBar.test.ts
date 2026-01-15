import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import WishlistFilterBar from '../../../app/components/wishlist/WishlistFilterBar.vue'
import type { WishlistQuery } from '../../../app/types/wishlist'

// useWorksをモック
const mockFetchWorks = vi.fn()
vi.mock('../../../app/composables/useWorks', () => ({
    useWorks: () => ({
        items: ref([
            { id: 1, name: 'アイドルマスター' },
            { id: 2, name: 'ラブライブ!' },
            { id: 3, name: 'バンドリ' },
        ]),
        loading: ref(false),
        error: ref(null),
        fetchWorks: mockFetchWorks,
    }),
}))

// useItemTypesをモック
const mockFetchItemTypes = vi.fn()
vi.mock('../../../app/composables/useItemTypes', () => ({
    useItemTypes: () => ({
        items: ref([
            { id: 1, name: 'フィギュア' },
            { id: 2, name: 'ぬいぐるみ' },
            { id: 3, name: 'アクリルスタンド' },
        ]),
        loading: ref(false),
        error: ref(null),
        fetchList: mockFetchItemTypes,
    }),
}))

describe('WishlistFilterBar.vue', () => {
    const defaultFilters: WishlistQuery = {
        workId: undefined,
        itemTypeId: undefined,
        sort: 'releaseDateDesc',
        page: 1,
        size: 20,
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('正しくレンダリングされる', () => {
        const wrapper = mount(WishlistFilterBar, {
            props: {
                filters: defaultFilters,
            },
        })

        expect(wrapper.find('.filterbar').exists()).toBe(true)
        expect(wrapper.findAll('select')).toHaveLength(3) // 作品、種類、ソート
    })

    it('onMountedでfetchWorksとfetchItemTypesが呼ばれる', () => {
        mount(WishlistFilterBar, {
            props: {
                filters: defaultFilters,
            },
        })

        expect(mockFetchWorks).toHaveBeenCalledWith({ page: 1, size: 200 })
        expect(mockFetchItemTypes).toHaveBeenCalledWith({ page: 1, size: 200 })
    })

    describe('作品セレクトボックス', () => {
        it('作品の選択肢が正しく表示される', () => {
            const wrapper = mount(WishlistFilterBar, {
                props: {
                    filters: defaultFilters,
                },
            })

            const workSelect = wrapper.findAll('select')[0]
            const options = workSelect.findAll('option')

            // 「作品：すべて」 + 3つの作品
            expect(options).toHaveLength(4)
            expect(options[0].text()).toBe('作品：すべて')
            expect(options[0].element.value).toBe('')
            expect(options[1].text()).toBe('アイドルマスター')
            expect(options[1].element.value).toBe('1')
            expect(options[2].text()).toBe('ラブライブ!')
            expect(options[2].element.value).toBe('2')
            expect(options[3].text()).toBe('バンドリ')
            expect(options[3].element.value).toBe('3')
        })

        it('作品変更時にupdate:filtersイベントが発火する', async () => {
            const wrapper = mount(WishlistFilterBar, {
                props: {
                    filters: defaultFilters,
                },
            })

            const workSelect = wrapper.findAll('select')[0]
            await workSelect.setValue('2')

            expect(wrapper.emitted('update:filters')).toBeTruthy()
            expect(wrapper.emitted('update:filters')?.[0]).toEqual([
                { workId: 2 },
            ])
        })

        it('作品を「すべて」に変更時にworkIdがundefinedになる', async () => {
            const wrapper = mount(WishlistFilterBar, {
                props: {
                    filters: { ...defaultFilters, workId: 2 },
                },
            })

            const workSelect = wrapper.findAll('select')[0]
            await workSelect.setValue('')

            expect(wrapper.emitted('update:filters')).toBeTruthy()
            expect(wrapper.emitted('update:filters')?.[0]).toEqual([
                { workId: undefined },
            ])
        })

        it('filters.workIdが反映される', () => {
            const wrapper = mount(WishlistFilterBar, {
                props: {
                    filters: { ...defaultFilters, workId: 2 },
                },
            })

            const workSelect = wrapper.findAll('select')[0]
            expect((workSelect.element as HTMLSelectElement).value).toBe('2')
        })

        it('filters.workIdがundefinedの場合は空文字が選択される', () => {
            const wrapper = mount(WishlistFilterBar, {
                props: {
                    filters: { ...defaultFilters, workId: undefined },
                },
            })

            const workSelect = wrapper.findAll('select')[0]
            expect((workSelect.element as HTMLSelectElement).value).toBe('')
        })
    })

    describe('種類セレクトボックス', () => {
        it('種類の選択肢が正しく表示される', () => {
            const wrapper = mount(WishlistFilterBar, {
                props: {
                    filters: defaultFilters,
                },
            })

            const typeSelect = wrapper.findAll('select')[1]
            const options = typeSelect.findAll('option')

            // 「種類：すべて」 + 3つのアイテムタイプ
            expect(options).toHaveLength(4)
            expect(options[0].text()).toBe('種類：すべて')
            expect(options[0].element.value).toBe('')
            expect(options[1].text()).toBe('フィギュア')
            expect(options[1].element.value).toBe('1')
            expect(options[2].text()).toBe('ぬいぐるみ')
            expect(options[2].element.value).toBe('2')
            expect(options[3].text()).toBe('アクリルスタンド')
            expect(options[3].element.value).toBe('3')
        })

        it('種類変更時にupdate:filtersイベントが発火する', async () => {
            const wrapper = mount(WishlistFilterBar, {
                props: {
                    filters: defaultFilters,
                },
            })

            const typeSelect = wrapper.findAll('select')[1]
            await typeSelect.setValue('3')

            expect(wrapper.emitted('update:filters')).toBeTruthy()
            expect(wrapper.emitted('update:filters')?.[0]).toEqual([
                { itemTypeId: 3 },
            ])
        })

        it('種類を「すべて」に変更時にitemTypeIdがundefinedになる', async () => {
            const wrapper = mount(WishlistFilterBar, {
                props: {
                    filters: { ...defaultFilters, itemTypeId: 3 },
                },
            })

            const typeSelect = wrapper.findAll('select')[1]
            await typeSelect.setValue('')

            expect(wrapper.emitted('update:filters')).toBeTruthy()
            expect(wrapper.emitted('update:filters')?.[0]).toEqual([
                { itemTypeId: undefined },
            ])
        })

        it('filters.itemTypeIdが反映される', () => {
            const wrapper = mount(WishlistFilterBar, {
                props: {
                    filters: { ...defaultFilters, itemTypeId: 2 },
                },
            })

            const typeSelect = wrapper.findAll('select')[1]
            expect((typeSelect.element as HTMLSelectElement).value).toBe('2')
        })

        it('filters.itemTypeIdがundefinedの場合は空文字が選択される', () => {
            const wrapper = mount(WishlistFilterBar, {
                props: {
                    filters: { ...defaultFilters, itemTypeId: undefined },
                },
            })

            const typeSelect = wrapper.findAll('select')[1]
            expect((typeSelect.element as HTMLSelectElement).value).toBe('')
        })
    })

    describe('ソートセレクトボックス', () => {
        it('ソートの選択肢が正しく表示される', () => {
            const wrapper = mount(WishlistFilterBar, {
                props: {
                    filters: defaultFilters,
                },
            })

            const sortSelect = wrapper.findAll('select')[2]
            const options = sortSelect.findAll('option')

            expect(options).toHaveLength(4)
            expect(options[0].text()).toBe('発売日（新しい順）')
            expect(options[0].element.value).toBe('releaseDateDesc')
            expect(options[1].text()).toBe('発売日（古い順）')
            expect(options[1].element.value).toBe('releaseDateAsc')
            expect(options[2].text()).toBe('登録日（新しい順）')
            expect(options[2].element.value).toBe('createdAtDesc')
            expect(options[3].text()).toBe('登録日（古い順）')
            expect(options[3].element.value).toBe('createdAtAsc')
        })

        it('ソート変更時にupdate:filtersイベントが発火する', async () => {
            const wrapper = mount(WishlistFilterBar, {
                props: {
                    filters: defaultFilters,
                },
            })

            const sortSelect = wrapper.findAll('select')[2]
            await sortSelect.setValue('releaseDateAsc')

            expect(wrapper.emitted('update:filters')).toBeTruthy()
            expect(wrapper.emitted('update:filters')?.[0]).toEqual([
                { sort: 'releaseDateAsc' },
            ])
        })

        it('filters.sortが反映される', () => {
            const wrapper = mount(WishlistFilterBar, {
                props: {
                    filters: { ...defaultFilters, sort: 'createdAtDesc' },
                },
            })

            const sortSelect = wrapper.findAll('select')[2]
            expect((sortSelect.element as HTMLSelectElement).value).toBe('createdAtDesc')
        })

        it('filters.sortがundefinedの場合はreleaseDateDescが選択される', () => {
            const wrapper = mount(WishlistFilterBar, {
                props: {
                    filters: { ...defaultFilters, sort: undefined },
                },
            })

            const sortSelect = wrapper.findAll('select')[2]
            expect((sortSelect.element as HTMLSelectElement).value).toBe('releaseDateDesc')
        })
    })

    describe('複数フィルターの同時変更', () => {
        it('作品と種類を連続して変更できる', async () => {
            const wrapper = mount(WishlistFilterBar, {
                props: {
                    filters: defaultFilters,
                },
            })

            const workSelect = wrapper.findAll('select')[0]
            const typeSelect = wrapper.findAll('select')[1]

            await workSelect.setValue('1')
            await typeSelect.setValue('2')

            expect(wrapper.emitted('update:filters')).toBeTruthy()
            expect(wrapper.emitted('update:filters')?.[0]).toEqual([{ workId: 1 }])
            expect(wrapper.emitted('update:filters')?.[1]).toEqual([{ itemTypeId: 2 }])
        })

        it('すべてのフィルターを変更できる', async () => {
            const wrapper = mount(WishlistFilterBar, {
                props: {
                    filters: defaultFilters,
                },
            })

            const workSelect = wrapper.findAll('select')[0]
            const typeSelect = wrapper.findAll('select')[1]
            const sortSelect = wrapper.findAll('select')[2]

            await workSelect.setValue('3')
            await typeSelect.setValue('1')
            await sortSelect.setValue('createdAtAsc')

            expect(wrapper.emitted('update:filters')).toHaveLength(3)
            expect(wrapper.emitted('update:filters')?.[0]).toEqual([{ workId: 3 }])
            expect(wrapper.emitted('update:filters')?.[1]).toEqual([{ itemTypeId: 1 }])
            expect(wrapper.emitted('update:filters')?.[2]).toEqual([{ sort: 'createdAtAsc' }])
        })
    })
})
