import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import WorksPage from '../../../../app/pages/settings/works/index.vue'

// 必要なcomposableのモック
const mockFetchWorks = vi.fn()
const mockCreateWork = vi.fn()
const mockUpdateWork = vi.fn()
const mockDeleteWork = vi.fn()
vi.mock('../../../../app/composables/useWorks', () => ({
    useWorks: () => ({
        items: [{ id: 1, name: '作品A', nameKana: 'さくひんえー', memo: 'メモ' }],
        loading: false,
        error: null,
        fetchWorks: mockFetchWorks,
        createWork: mockCreateWork,
        updateWork: mockUpdateWork,
        deleteWork: mockDeleteWork
    })
}))

// コンポーネントのモック
vi.mock('../../../../app/components/settings/WorksList.vue', () => ({
    default: { name: 'WorksList', template: '<div />' }
}))
vi.mock('../../../../app/components/settings/WorksFormModal.vue', () => ({
    default: { name: 'WorksFormModal', template: '<div />' }
}))
vi.mock('../../../../app/components/common/DeleteConfirmModal.vue', () => ({
    default: { name: 'DeleteConfirmModal', template: '<div />' }
}))
vi.mock('../../../../app/components/common/PageTitle.vue', () => ({
    default: { name: 'PageTitle', template: '<div>作品管理</div>' }
}))

describe('SettingsWorksPage', () => {
    let wrapper: any

    beforeEach(async () => {
        mockFetchWorks.mockClear()
        mockCreateWork.mockClear()
        mockUpdateWork.mockClear()
        mockDeleteWork.mockClear()
        wrapper = mount(WorksPage)
        await new Promise(r => setTimeout(r, 0))
    })

    it('タイトルが表示される', () => {
        expect(wrapper.text()).toContain('作品管理')
    })

    it('WorksListが表示される', () => {
        expect(wrapper.findComponent({ name: 'WorksList' }).exists()).toBe(true)
    })

    it('WorksFormModalが表示される', async () => {
        wrapper.vm.showFormModal = true
        await wrapper.vm.$nextTick()
        expect(wrapper.findComponent({ name: 'WorksFormModal' }).exists()).toBe(true)
    })

    it('DeleteConfirmModalが表示される', async () => {
        wrapper.vm.showDeleteModal = true
        await wrapper.vm.$nextTick()
        expect(wrapper.findComponent({ name: 'DeleteConfirmModal' }).exists()).toBe(true)
    })

    it('openAddModalでフォームモーダルが開く', async () => {
        wrapper.vm.openAddModal()
        expect(wrapper.vm.showFormModal).toBe(true)
        expect(wrapper.vm.editingWork).toBe(null)
        expect(wrapper.vm.formData).toEqual({ name: '', nameKana: '', memo: '' })
    })

    it('openEditModalで編集モーダルが開く', async () => {
        const work = { id: 2, name: '編集作品', nameKana: 'へんしゅう', memo: '編集メモ' }
        wrapper.vm.openEditModal(work)
        expect(wrapper.vm.showFormModal).toBe(true)
        expect(wrapper.vm.editingWork).toEqual(work)
        expect(wrapper.vm.formData).toEqual({ name: '編集作品', nameKana: 'へんしゅう', memo: '編集メモ' })
    })

    it('submitFormで新規登録が呼ばれる', async () => {
        wrapper.vm.editingWork = null
        wrapper.vm.formData = { name: '新規作品', nameKana: 'しんき', memo: '新規メモ' }
        await wrapper.vm.submitForm()
        expect(mockCreateWork).toHaveBeenCalledWith({ name: '新規作品', nameKana: 'しんき', memo: '新規メモ' })
        expect(mockFetchWorks).toHaveBeenCalled()
    })

    it('submitFormで編集が呼ばれる', async () => {
        wrapper.vm.editingWork = { id: 3, name: '編集作品', nameKana: 'へんしゅう', memo: '編集メモ' }
        wrapper.vm.formData = { name: '編集作品', nameKana: 'へんしゅう', memo: '編集メモ' }
        await wrapper.vm.submitForm()
        expect(mockUpdateWork).toHaveBeenCalledWith(3, { name: '編集作品', nameKana: 'へんしゅう', memo: '編集メモ' })
        expect(mockFetchWorks).toHaveBeenCalled()
    })

    it('submitFormで読み仮名バリデーションエラー時はエラーモーダルが開く', async () => {
        wrapper.vm.editingWork = null
        wrapper.vm.formData = { name: '新規作品', nameKana: 'abc', memo: '新規メモ' }
        await wrapper.vm.submitForm()
        expect(wrapper.vm.showErrorModal).toBe(true)
        expect(wrapper.vm.deleteErrorMessage).toBe('読み仮名はひらがなで入力してください')
    })

    it('submitFormでAPIエラー時はエラーモーダルが開く', async () => {
        mockCreateWork.mockImplementationOnce(() => { throw new Error('登録エラー') })
        wrapper.vm.editingWork = null
        wrapper.vm.formData = { name: '新規作品', nameKana: 'しんき', memo: '新規メモ' }
        await wrapper.vm.submitForm()
        expect(wrapper.vm.showErrorModal).toBe(true)
        expect(wrapper.vm.deleteErrorMessage).toBe('登録エラー')
    })

    it('openDeleteModalで削除モーダルが開く', async () => {
        const work = { id: 4, name: '削除作品', nameKana: 'さくじょ', memo: '' }
        wrapper.vm.openDeleteModal(work)
        expect(wrapper.vm.showDeleteModal).toBe(true)
        expect(wrapper.vm.deletingWork).toEqual(work)
    })

    it('confirmDeleteで削除が呼ばれる', async () => {
        wrapper.vm.deletingWork = { id: 5, name: '削除作品', nameKana: 'さくじょ', memo: '' }
        await wrapper.vm.confirmDelete()
        expect(mockDeleteWork).toHaveBeenCalledWith(5)
        expect(wrapper.vm.showSuccessModal).toBe(true)
    })

    it('confirmDeleteで削除失敗時はエラーモーダルが開く', async () => {
        mockDeleteWork.mockImplementationOnce(() => { throw new Error('削除エラー') })
        wrapper.vm.deletingWork = { id: 6, name: '削除作品', nameKana: 'さくじょ', memo: '' }
        await wrapper.vm.confirmDelete()
        expect(wrapper.vm.showErrorModal).toBe(true)
        expect(wrapper.vm.deleteErrorMessage).toBe('削除エラー')
    })

    it('closeSuccessModalで一覧が更新される', async () => {
        await wrapper.vm.closeSuccessModal()
        expect(mockFetchWorks).toHaveBeenCalled()
        expect(wrapper.vm.showSuccessModal).toBe(false)
        expect(wrapper.vm.deletingWork).toBe(null)
    })

    it('closeErrorModalで一覧が更新される', async () => {
        await wrapper.vm.closeErrorModal()
        expect(mockFetchWorks).toHaveBeenCalled()
        expect(wrapper.vm.showErrorModal).toBe(false)
    })
})
