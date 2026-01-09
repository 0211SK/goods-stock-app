import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ItemTypesPage from '../../../../app/pages/settings/item-types/index.vue'

// 必要なcomposableのモック
const mockFetchList = vi.fn()
const mockCreateItemType = vi.fn()
const mockUpdateItemType = vi.fn()
const mockDeleteItemType = vi.fn()
vi.mock('../../../../app/composables/useItemTypes', () => ({
    useItemTypes: () => ({
        items: [{ id: 1, name: '種類A' }],
        loading: false,
        fetchList: mockFetchList,
        createItemType: mockCreateItemType,
        updateItemType: mockUpdateItemType,
        deleteItemType: mockDeleteItemType
    })
}))

// コンポーネントのモック
vi.mock('../../../../app/components/settings/ItemTypesList.vue', () => ({
    default: { name: 'ItemTypesList', template: '<div />' }
}))
vi.mock('../../../../app/components/settings/ItemTypesFormModal.vue', () => ({
    default: { name: 'ItemTypesFormModal', template: '<div />' }
}))
vi.mock('../../../../app/components/common/DeleteConfirmModal.vue', () => ({
    default: { name: 'DeleteConfirmModal', template: '<div />' }
}))
vi.mock('../../../../app/components/common/PageTitle.vue', () => ({
    default: { name: 'PageTitle', template: '<div>種類管理</div>' }
}))

describe('SettingsItemTypesPage', () => {
    let wrapper: any

    beforeEach(async () => {
        mockFetchList.mockClear()
        mockCreateItemType.mockClear()
        mockUpdateItemType.mockClear()
        mockDeleteItemType.mockClear()
        wrapper = mount(ItemTypesPage)
        await new Promise(r => setTimeout(r, 0))
    })

    it('タイトルが表示される', () => {
        expect(wrapper.text()).toContain('種類管理')
    })

    it('ItemTypesListが表示される', () => {
        expect(wrapper.findComponent({ name: 'ItemTypesList' }).exists()).toBe(true)
    })

    it('ItemTypesFormModalが表示される', async () => {
        wrapper.vm.showFormModal = true
        await wrapper.vm.$nextTick()
        expect(wrapper.findComponent({ name: 'ItemTypesFormModal' }).exists()).toBe(true)
    })

    it('DeleteConfirmModalが表示される', async () => {
        wrapper.vm.showDeleteModal = true
        await wrapper.vm.$nextTick()
        expect(wrapper.findComponent({ name: 'DeleteConfirmModal' }).exists()).toBe(true)
    })

    it('openAddModalでフォームモーダルが開く', async () => {
        wrapper.vm.openAddModal()
        expect(wrapper.vm.showFormModal).toBe(true)
        expect(wrapper.vm.editingType).toBe(null)
        expect(wrapper.vm.formData).toEqual({ name: '' })
    })

    it('openEditModalで編集モーダルが開く', async () => {
        const type = { id: 2, name: '編集種類' }
        wrapper.vm.openEditModal(type)
        expect(wrapper.vm.showFormModal).toBe(true)
        expect(wrapper.vm.editingType).toEqual(type)
        expect(wrapper.vm.formData).toEqual({ name: '編集種類' })
    })

    it('submitFormで新規登録が呼ばれる', async () => {
        wrapper.vm.editingType = null
        wrapper.vm.formData = { name: '新規種類' }
        await wrapper.vm.submitForm()
        expect(mockCreateItemType).toHaveBeenCalledWith({ name: '新規種類' })
        expect(mockFetchList).toHaveBeenCalled()
    })

    it('submitFormで編集が呼ばれる', async () => {
        wrapper.vm.editingType = { id: 3, name: '編集種類' }
        wrapper.vm.formData = { name: '編集種類' }
        await wrapper.vm.submitForm()
        expect(mockUpdateItemType).toHaveBeenCalledWith(3, { name: '編集種類' })
        expect(mockFetchList).toHaveBeenCalled()
    })

    it('openDeleteModalで削除モーダルが開く', async () => {
        const type = { id: 4, name: '削除種類' }
        wrapper.vm.openDeleteModal(type)
        expect(wrapper.vm.showDeleteModal).toBe(true)
        expect(wrapper.vm.deletingType).toEqual(type)
    })

    it('confirmDeleteで削除が呼ばれる', async () => {
        wrapper.vm.deletingType = { id: 5, name: '削除種類' }
        await wrapper.vm.confirmDelete()
        expect(mockDeleteItemType).toHaveBeenCalledWith(5)
        expect(wrapper.vm.showSuccessModal).toBe(true)
    })

    it('confirmDeleteで削除失敗時はエラーモーダルが開く', async () => {
        mockDeleteItemType.mockImplementationOnce(() => { throw new Error('削除エラー') })
        wrapper.vm.deletingType = { id: 6, name: '削除種類' }
        await wrapper.vm.confirmDelete()
        expect(wrapper.vm.showErrorModal).toBe(true)
        expect(wrapper.vm.deleteErrorMessage).toBe('削除エラー')
    })

    it('closeSuccessModalで一覧が更新される', async () => {
        await wrapper.vm.closeSuccessModal()
        expect(mockFetchList).toHaveBeenCalled()
        expect(wrapper.vm.showSuccessModal).toBe(false)
        expect(wrapper.vm.deletingType).toBe(null)
    })
})
