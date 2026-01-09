import { describe, it, expect, vi, beforeEach } from 'vitest'
import { type FooterButton } from '../../app/composables/useFooterButtons'

describe('useFooterButtons', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('ボタン配列を作成できる', async () => {
        const buttons: FooterButton[] = [
            { label: 'テストボタン', icon: '✓', onClick: vi.fn() },
            { label: '削除', icon: '×', onClick: vi.fn(), class: 'danger' },
        ]

        const mockUseState = vi.spyOn(global as any, 'useState')
        const { useFooterButtons } = await import('../../app/composables/useFooterButtons')
        useFooterButtons(buttons)

        // useStateが正しく呼ばれたことを確認
        expect(mockUseState).toHaveBeenCalledWith('footerExtraButtons', expect.any(Function))
    })

    it('FooterButtonの型が正しい', () => {
        const button: FooterButton = {
            label: 'ボタン',
            icon: '➕',
            onClick: () => console.log('clicked'),
            class: 'primary',
        }

        expect(button.label).toBe('ボタン')
        expect(button.icon).toBe('➕')
        expect(typeof button.onClick).toBe('function')
        expect(button.class).toBe('primary')
    })

    it('classプロパティはオプショナル', () => {
        const button: FooterButton = {
            label: 'ボタン',
            icon: '➕',
            onClick: () => { },
        }

        expect(button.class).toBeUndefined()
    })
})
