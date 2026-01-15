import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import WorksList from '../../../app/components/settings/WorksList.vue'
import type { WorkItem } from '../../../app/composables/useWorks'

describe('WorksList.vue', () => {
    const mockWorks: WorkItem[] = [
        { id: 1, name: 'アイドルマスター', nameKana: 'あいどるますたー', memo: 'メモ1' },
        { id: 2, name: 'ラブライブ!', nameKana: 'らぶらいぶ', memo: null },
        { id: 3, name: 'バンドリ', nameKana: null, memo: 'メモ3' },
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
            const wrapper = mount(WorksList, {
                props: { ...defaultProps, loading: true },
            })

            expect(wrapper.find('.loading').exists()).toBe(true)
            expect(wrapper.find('.loading').text()).toBe('読み込み中...')
            expect(wrapper.find('.works-list').exists()).toBe(false)
        })

        it('error状態が正しく表示される', () => {
            const wrapper = mount(WorksList, {
                props: { ...defaultProps, error: 'エラーが発生しました' },
            })

            expect(wrapper.find('.error').exists()).toBe(true)
            expect(wrapper.find('.error').text()).toBe('エラーが発生しました')
            expect(wrapper.find('.works-list').exists()).toBe(false)
        })

        it('データなし状態が正しく表示される', () => {
            const wrapper = mount(WorksList, {
                props: { ...defaultProps, items: [] },
            })

            expect(wrapper.find('.empty').exists()).toBe(true)
            expect(wrapper.find('.empty').text()).toBe('作品がまだ登録されていません')
            expect(wrapper.find('.works-list').exists()).toBe(false)
        })

        it('ローディング中でitemがある場合はローディングが非表示', () => {
            const wrapper = mount(WorksList, {
                props: { ...defaultProps, loading: true, items: mockWorks },
            })

            expect(wrapper.find('.loading').exists()).toBe(false)
            expect(wrapper.find('.works-list').exists()).toBe(true)
        })
    })

    describe('作品一覧の表示', () => {
        it('作品一覧が正しく表示される', () => {
            const wrapper = mount(WorksList, {
                props: { ...defaultProps, items: mockWorks },
            })

            expect(wrapper.find('.works-list').exists()).toBe(true)
            const workCards = wrapper.findAll('.work-card')
            expect(workCards).toHaveLength(3)
        })

        it('各作品の名前が正しく表示される', () => {
            const wrapper = mount(WorksList, {
                props: { ...defaultProps, items: mockWorks },
            })

            const workCards = wrapper.findAll('.work-card')
            expect(workCards[0].find('h3').text()).toBe('アイドルマスター')
            expect(workCards[1].find('h3').text()).toBe('ラブライブ!')
            expect(workCards[2].find('h3').text()).toBe('バンドリ')
        })

        it('nameKanaがある場合はよみがなが表示される', () => {
            const wrapper = mount(WorksList, {
                props: { ...defaultProps, items: mockWorks },
            })

            const workCards = wrapper.findAll('.work-card')
            expect(workCards[0].find('.kana').exists()).toBe(true)
            expect(workCards[0].find('.kana').text()).toBe('あいどるますたー')
            expect(workCards[1].find('.kana').exists()).toBe(true)
            expect(workCards[1].find('.kana').text()).toBe('らぶらいぶ')
        })

        it('nameKanaがない場合はよみがなが表示されない', () => {
            const wrapper = mount(WorksList, {
                props: { ...defaultProps, items: mockWorks },
            })

            const workCards = wrapper.findAll('.work-card')
            expect(workCards[2].find('.kana').exists()).toBe(false)
        })

        it('各作品に編集と削除ボタンが表示される', () => {
            const wrapper = mount(WorksList, {
                props: { ...defaultProps, items: mockWorks },
            })

            const workCards = wrapper.findAll('.work-card')
            workCards.forEach((card) => {
                expect(card.find('.btn-edit').exists()).toBe(true)
                expect(card.find('.btn-delete').exists()).toBe(true)
                expect(card.find('.btn-edit').text()).toBe('編集')
                expect(card.find('.btn-delete').text()).toBe('削除')
            })
        })
    })

    describe('イベント発火', () => {
        it('新規登録ボタンのクリックでaddイベントが発火する', async () => {
            const wrapper = mount(WorksList, {
                props: defaultProps,
            })

            const addButton = wrapper.find('.btn-add')
            await addButton.trigger('click')

            expect(wrapper.emitted('add')).toBeTruthy()
            expect(wrapper.emitted('add')?.length).toBe(1)
        })

        it('編集ボタンのクリックでeditイベントが発火する', async () => {
            const wrapper = mount(WorksList, {
                props: { ...defaultProps, items: mockWorks },
            })

            const editButton = wrapper.findAll('.btn-edit')[0]
            await editButton.trigger('click')

            expect(wrapper.emitted('edit')).toBeTruthy()
            expect(wrapper.emitted('edit')?.[0]).toEqual([mockWorks[0]])
        })

        it('削除ボタンのクリックでdeleteイベントが発火する', async () => {
            const wrapper = mount(WorksList, {
                props: { ...defaultProps, items: mockWorks },
            })

            const deleteButton = wrapper.findAll('.btn-delete')[1]
            await deleteButton.trigger('click')

            expect(wrapper.emitted('delete')).toBeTruthy()
            expect(wrapper.emitted('delete')?.[0]).toEqual([mockWorks[1]])
        })

        it('複数の作品の編集ボタンがそれぞれ正しい作品を渡す', async () => {
            const wrapper = mount(WorksList, {
                props: { ...defaultProps, items: mockWorks },
            })

            const editButtons = wrapper.findAll('.btn-edit')

            await editButtons[0].trigger('click')
            expect(wrapper.emitted('edit')?.[0]).toEqual([mockWorks[0]])

            await editButtons[2].trigger('click')
            expect(wrapper.emitted('edit')?.[1]).toEqual([mockWorks[2]])
        })
    })

    describe('UI要素の確認', () => {
        it('新規登録ボタンが常に表示される', () => {
            const wrapper = mount(WorksList, {
                props: defaultProps,
            })

            const addButton = wrapper.find('.btn-add')
            expect(addButton.exists()).toBe(true)
            expect(addButton.text()).toBe('+ 新規登録')
        })

        it('loading時でも新規登録ボタンは表示される', () => {
            const wrapper = mount(WorksList, {
                props: { ...defaultProps, loading: true },
            })

            expect(wrapper.find('.btn-add').exists()).toBe(true)
        })

        it('error時でも新規登録ボタンは表示される', () => {
            const wrapper = mount(WorksList, {
                props: { ...defaultProps, error: 'エラー' },
            })

            expect(wrapper.find('.btn-add').exists()).toBe(true)
        })
    })
})
