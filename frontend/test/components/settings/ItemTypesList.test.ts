import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ItemTypesList from '../../../app/components/settings/ItemTypesList.vue'
import type { ItemType } from '../../../app/composables/useItemTypes'

describe('ItemTypesList.vue', () => {
    const mockItems: ItemType[] = [
        { id: 1, name: 'フィギュア', createdAt: '2024-01-01' },
        { id: 2, name: 'ぬいぐるみ', createdAt: '2024-01-02' },
        { id: 3, name: 'アクリルスタンド', createdAt: '2024-01-03' },
    ]

    const defaultProps = {
        items: [],
        loading: false,
        error: null,
    }

    beforeEach(() => {
        // 各テスト前のクリーンアップ
    })

    describe('状態表示', () => {
        it('loading状態が正しく表示される', () => {
            const wrapper = mount(ItemTypesList, {
                props: { ...defaultProps, loading: true },
            })

            expect(wrapper.find('.loading').exists()).toBe(true)
            expect(wrapper.find('.loading').text()).toBe('読み込み中...')
            expect(wrapper.find('.types-list').exists()).toBe(false)
        })

        it('error状態が正しく表示される', () => {
            const wrapper = mount(ItemTypesList, {
                props: { ...defaultProps, error: 'エラーが発生しました' },
            })

            expect(wrapper.find('.error').exists()).toBe(true)
            expect(wrapper.find('.error').text()).toBe('エラーが発生しました')
            expect(wrapper.find('.types-list').exists()).toBe(false)
        })

        it('データなし状態が正しく表示される', () => {
            const wrapper = mount(ItemTypesList, {
                props: { ...defaultProps, items: [] },
            })

            expect(wrapper.find('.empty').exists()).toBe(true)
            expect(wrapper.find('.empty').text()).toBe('種類がまだ登録されていません')
            expect(wrapper.find('.types-list').exists()).toBe(false)
        })

        it('ローディング中でitemがある場合はローディングが非表示', () => {
            const wrapper = mount(ItemTypesList, {
                props: { ...defaultProps, loading: true, items: mockItems },
            })

            expect(wrapper.find('.loading').exists()).toBe(false)
            expect(wrapper.find('.types-list').exists()).toBe(true)
        })
    })

    describe('アイテム一覧の表示', () => {
        it('アイテム一覧が正しく表示される', () => {
            const wrapper = mount(ItemTypesList, {
                props: { ...defaultProps, items: mockItems },
            })

            expect(wrapper.find('.types-list').exists()).toBe(true)
            const typeCards = wrapper.findAll('.type-card')
            expect(typeCards).toHaveLength(3)
        })

        it('各アイテムの名前が正しく表示される', () => {
            const wrapper = mount(ItemTypesList, {
                props: { ...defaultProps, items: mockItems },
            })

            const typeCards = wrapper.findAll('.type-card')
            expect(typeCards[0].find('h3').text()).toBe('フィギュア')
            expect(typeCards[1].find('h3').text()).toBe('ぬいぐるみ')
            expect(typeCards[2].find('h3').text()).toBe('アクリルスタンド')
        })

        it('各アイテムに編集と削除ボタンが表示される', () => {
            const wrapper = mount(ItemTypesList, {
                props: { ...defaultProps, items: mockItems },
            })

            const typeCards = wrapper.findAll('.type-card')
            typeCards.forEach((card) => {
                expect(card.find('.btn-edit').exists()).toBe(true)
                expect(card.find('.btn-delete').exists()).toBe(true)
                expect(card.find('.btn-edit').text()).toBe('編集')
                expect(card.find('.btn-delete').text()).toBe('削除')
            })
        })
    })

    describe('イベント発火', () => {
        it('新規登録ボタンのクリックでaddイベントが発火する', async () => {
            const wrapper = mount(ItemTypesList, {
                props: defaultProps,
            })

            const addButton = wrapper.find('.btn-add')
            await addButton.trigger('click')

            expect(wrapper.emitted('add')).toBeTruthy()
            expect(wrapper.emitted('add')?.length).toBe(1)
        })

        it('編集ボタンのクリックでeditイベントが発火する', async () => {
            const wrapper = mount(ItemTypesList, {
                props: { ...defaultProps, items: mockItems },
            })

            const editButton = wrapper.findAll('.btn-edit')[0]
            await editButton.trigger('click')

            expect(wrapper.emitted('edit')).toBeTruthy()
            expect(wrapper.emitted('edit')?.[0]).toEqual([mockItems[0]])
        })

        it('削除ボタンのクリックでdeleteイベントが発火する', async () => {
            const wrapper = mount(ItemTypesList, {
                props: { ...defaultProps, items: mockItems },
            })

            const deleteButton = wrapper.findAll('.btn-delete')[1]
            await deleteButton.trigger('click')

            expect(wrapper.emitted('delete')).toBeTruthy()
            expect(wrapper.emitted('delete')?.[0]).toEqual([mockItems[1]])
        })

        it('複数のアイテムの編集ボタンがそれぞれ正しいアイテムを渡す', async () => {
            const wrapper = mount(ItemTypesList, {
                props: { ...defaultProps, items: mockItems },
            })

            const editButtons = wrapper.findAll('.btn-edit')

            await editButtons[0].trigger('click')
            expect(wrapper.emitted('edit')?.[0]).toEqual([mockItems[0]])

            await editButtons[2].trigger('click')
            expect(wrapper.emitted('edit')?.[1]).toEqual([mockItems[2]])
        })
    })

    describe('UI要素の確認', () => {
        it('新規登録ボタンが常に表示される', () => {
            const wrapper = mount(ItemTypesList, {
                props: defaultProps,
            })

            const addButton = wrapper.find('.btn-add')
            expect(addButton.exists()).toBe(true)
            expect(addButton.text()).toBe('+ 新規登録')
        })

        it('loading時でも新規登録ボタンは表示される', () => {
            const wrapper = mount(ItemTypesList, {
                props: { ...defaultProps, loading: true },
            })

            expect(wrapper.find('.btn-add').exists()).toBe(true)
        })

        it('error時でも新規登録ボタンは表示される', () => {
            const wrapper = mount(ItemTypesList, {
                props: { ...defaultProps, error: 'エラー' },
            })

            expect(wrapper.find('.btn-add').exists()).toBe(true)
        })
    })
})
