import { describe, it, expect } from 'vitest'
import { GOJUON, type GojuonGroup } from '../../app/constants/gojuon'

describe('GOJUON', () => {
    it('10個のグループが存在する', () => {
        expect(GOJUON).toHaveLength(10)
    })

    it('各グループにkeyとcharsプロパティがある', () => {
        GOJUON.forEach((group: GojuonGroup) => {
            expect(group).toHaveProperty('key')
            expect(group).toHaveProperty('chars')
            expect(typeof group.key).toBe('string')
            expect(Array.isArray(group.chars)).toBe(true)
        })
    })

    it('正しいキーの順序を持つ', () => {
        const expectedKeys = ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ']
        const actualKeys = GOJUON.map((g: GojuonGroup) => g.key)
        expect(actualKeys).toEqual(expectedKeys)
    })

    it('あ行に5つの文字がある', () => {
        const aGroup = GOJUON.find((g: GojuonGroup) => g.key === 'あ')
        expect(aGroup?.chars).toHaveLength(5)
        expect(aGroup?.chars).toEqual(['あ', 'い', 'う', 'え', 'お'])
    })

    it('や行に3つの文字がある', () => {
        const yaGroup = GOJUON.find((g: GojuonGroup) => g.key === 'や')
        expect(yaGroup?.chars).toHaveLength(3)
        expect(yaGroup?.chars).toEqual(['や', 'ゆ', 'よ'])
    })

    it('わ行に「を」と「ん」が含まれる', () => {
        const waGroup = GOJUON.find((g: GojuonGroup) => g.key === 'わ')
        expect(waGroup?.chars).toContain('を')
        expect(waGroup?.chars).toContain('ん')
    })
})
