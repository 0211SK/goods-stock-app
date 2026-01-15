export type GojuonGroup = {
    key: string
    chars: readonly string[]
}

export const GOJUON: readonly GojuonGroup[] = [
    { key: 'あ', chars: ['あ', 'い', 'う', 'え', 'お'] },
    { key: 'か', chars: ['か', 'き', 'く', 'け', 'こ'] },
    { key: 'さ', chars: ['さ', 'し', 'す', 'せ', 'そ'] },
    { key: 'た', chars: ['た', 'ち', 'つ', 'て', 'と'] },
    { key: 'な', chars: ['な', 'に', 'ぬ', 'ね', 'の'] },
    { key: 'は', chars: ['は', 'ひ', 'ふ', 'へ', 'ほ'] },
    { key: 'ま', chars: ['ま', 'み', 'む', 'め', 'も'] },
    { key: 'や', chars: ['や', 'ゆ', 'よ'] },
    { key: 'ら', chars: ['ら', 'り', 'る', 'れ', 'ろ'] },
    { key: 'わ', chars: ['わ', 'を', 'ん'] },
]
