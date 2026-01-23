import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import InventoryDetailPage from '../../../app/pages/inventory/[workId]/[id]/index.vue'

vi.mock('../../../app/composables/useImageUpload', () => ({
    default: () => ({
        uploadImage: vi.fn(),
        deleteImage: vi.fn(),
        getImageUrl: vi.fn(),
    }),
}))
// 削除失敗用composableのモック
vi.mock('../../../app/composables/useOwnedItems', () => ({
    useOwnedItems: () => ({
        loading: false,
        error: '',
        fetchDetail: vi.fn(async () => ({ id: 1, workId: 2, goodsName: 'test' })),
        deleteItem: vi.fn(async () => { throw new Error('削除エラー') })
    })
}))
vi.mock('../../../app/composables/useFooterButtons', () => ({
    useFooterButtons: vi.fn()
}))

// #importsのモック
const mockPush = vi.fn()
vi.mock('#imports', () => ({
    useRoute: () => ({ params: { id: '1', workId: '2' } }),
    useRouter: () => ({ push: mockPush })
}))

describe('InventoryDetailPage (削除失敗ケース)', () => {
    let wrapper: any

    beforeEach(async () => {
        wrapper = mount(InventoryDetailPage)
        await new Promise(r => setTimeout(r, 0))
    })

    it('削除失敗でエラーモーダルが表示される', async () => {
        wrapper.vm.showDeleteModal = true
        await wrapper.vm.confirmDelete()
        expect(wrapper.vm.showErrorModal).toBe(true)
        expect(wrapper.vm.deleteErrorMessage).toBe('削除エラー')
    })
})
