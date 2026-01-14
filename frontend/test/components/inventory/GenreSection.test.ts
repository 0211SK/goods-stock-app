import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import GenreSection from '../../../app/components/inventory/GenreSection.vue'

describe('GenreSection.vue', () => {
    const mockGenres = [
        { id: 1, name: 'あんさんぶるスターズ', nameKana: 'あんさんぶるすたーず' },
        { id: 2, name: 'かげきしょうじょ', nameKana: 'かげきしょうじょ' },
        { id: 3, name: 'アイドルマスター', nameKana: 'あいどるますたー' },
        { id: 4, name: 'さくら荘のペットな彼女', nameKana: 'さくらそうのぺっとなかのじょ' },
        { id: 5, name: '鬼滅の刃', nameKana: 'きめつのやいば' },
    ]

    beforeEach(() => {
        // テストごとにクリーンな状態にする
    })

    it('正しくレンダリングされる', () => {
        const wrapper = mount(GenreSection, {
            props: {
                genres: mockGenres,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :href="to"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        expect(wrapper.find('.genre').exists()).toBe(true)
        expect(wrapper.find('.genre__search').exists()).toBe(true)
        expect(wrapper.find('.genre__input').exists()).toBe(true)
    })

    it('作品リストが表示される', () => {
        const wrapper = mount(GenreSection, {
            props: {
                genres: mockGenres,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :href="to"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        expect(wrapper.find('.genre__groups').exists()).toBe(true)
        expect(wrapper.findAll('.genre__row')).toHaveLength(5)
    })

    it('五十音グループが正しく表示される', () => {
        const wrapper = mount(GenreSection, {
            props: {
                genres: mockGenres,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :href="to"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const groups = wrapper.findAll('.genre__group-key')
        const groupTexts = groups.map(g => g.text())

        // 「あ」「か」「さ」グループが存在するはず
        expect(groupTexts).toContain('あ')
        expect(groupTexts).toContain('か')
        expect(groupTexts).toContain('さ')
    })

    it('検索入力が動作する', async () => {
        const wrapper = mount(GenreSection, {
            props: {
                genres: mockGenres,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :href="to"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const input = wrapper.find('.genre__input')
        await input.setValue('かげき')
        await nextTick()

        const rows = wrapper.findAll('.genre__row')
        expect(rows).toHaveLength(1)
        expect(wrapper.text()).toContain('かげきしょうじょ')
    })

    it('かな名で検索できる', async () => {
        const wrapper = mount(GenreSection, {
            props: {
                genres: mockGenres,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :href="to"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const input = wrapper.find('.genre__input')
        await input.setValue('きめつ')
        await nextTick()

        const rows = wrapper.findAll('.genre__row')
        expect(rows).toHaveLength(1)
        expect(wrapper.text()).toContain('鬼滅の刃')
    })

    it('検索入力がある場合にクリアボタンが表示される', async () => {
        const wrapper = mount(GenreSection, {
            props: {
                genres: mockGenres,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :href="to"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        expect(wrapper.find('.genre__clear').exists()).toBe(false)

        const input = wrapper.find('.genre__input')
        await input.setValue('test')
        await nextTick()

        expect(wrapper.find('.genre__clear').exists()).toBe(true)
    })

    it('クリアボタンクリックで検索条件がクリアされる', async () => {
        const wrapper = mount(GenreSection, {
            props: {
                genres: mockGenres,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :href="to"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const input = wrapper.find('.genre__input')
        await input.setValue('かげき')
        await nextTick()

        expect(wrapper.findAll('.genre__row')).toHaveLength(1)

        const clearButton = wrapper.find('.genre__clear')
        await clearButton.trigger('click')
        await nextTick()

        expect((input.element as HTMLInputElement).value).toBe('')
        expect(wrapper.findAll('.genre__row')).toHaveLength(5)
    })

    it('検索結果が0件の場合は「作品が存在しません」が表示される', async () => {
        const wrapper = mount(GenreSection, {
            props: {
                genres: mockGenres,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :href="to"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const input = wrapper.find('.genre__input')
        await input.setValue('存在しない作品名')
        await nextTick()

        expect(wrapper.find('.genre__empty').exists()).toBe(true)
        expect(wrapper.find('.genre__empty').text()).toBe('作品が存在しません')
        expect(wrapper.find('.genre__groups').exists()).toBe(false)
    })

    it('genresが空の場合は「作品が存在しません」が表示される', () => {
        const wrapper = mount(GenreSection, {
            props: {
                genres: [],
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :href="to"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        expect(wrapper.find('.genre__empty').exists()).toBe(true)
        expect(wrapper.find('.genre__empty').text()).toBe('作品が存在しません')
        expect(wrapper.find('.genre__groups').exists()).toBe(false)
    })

    it('NuxtLinkが正しいURLを指している', () => {
        const wrapper = mount(GenreSection, {
            props: {
                genres: [{ id: 123, name: 'テスト作品', nameKana: 'てすとさくひん' }],
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :href="to"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const link = wrapper.find('a')
        expect(link.attributes('href')).toBe('/inventory/123')
    })

    it('各作品行に名前と矢印が表示される', () => {
        const wrapper = mount(GenreSection, {
            props: {
                genres: [{ id: 1, name: 'テスト作品', nameKana: 'てすとさくひん' }],
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :href="to"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const row = wrapper.find('.genre__row')
        expect(row.find('.genre__name').text()).toBe('テスト作品')
        expect(row.find('.genre__arrow').text()).toBe('›')
    })

    it('nameKanaがnullの場合は「その他」グループに分類される', () => {
        const wrapper = mount(GenreSection, {
            props: {
                genres: [
                    { id: 1, name: 'テスト作品', nameKana: null },
                ],
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :href="to"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const groupKey = wrapper.find('.genre__group-key')
        expect(groupKey.text()).toBe('その他')
    })

    it('グループ内で作品が名前順にソートされる', () => {
        const wrapper = mount(GenreSection, {
            props: {
                genres: [
                    { id: 1, name: 'あんさんぶるスターズ', nameKana: 'あんさんぶるすたーず' },
                    { id: 2, name: 'アイドルマスター', nameKana: 'あいどるますたー' },
                    { id: 3, name: 'あずまんが大王', nameKana: 'あずまんがだいおう' },
                ],
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :href="to"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const names = wrapper.findAll('.genre__name').map(n => n.text())
        expect(names).toEqual(['アイドルマスター', 'あずまんが大王', 'あんさんぶるスターズ'])
    })

    it('検索時に空白がトリムされる', async () => {
        const wrapper = mount(GenreSection, {
            props: {
                genres: mockGenres,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :href="to"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const input = wrapper.find('.genre__input')
        await input.setValue('  かげき  ')
        await nextTick()

        const rows = wrapper.findAll('.genre__row')
        expect(rows).toHaveLength(1)
        expect(wrapper.text()).toContain('かげきしょうじょ')
    })

    it('検索入力が空白のみの場合は全件表示される', async () => {
        const wrapper = mount(GenreSection, {
            props: {
                genres: mockGenres,
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :href="to"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const input = wrapper.find('.genre__input')
        await input.setValue('   ')
        await nextTick()

        expect(wrapper.findAll('.genre__row')).toHaveLength(5)
    })
    it('エラー時にエラーメッセージが表示される', () => {
        const wrapper = mount(GenreSection, {
            props: {
                genres: [],
                error: 'API error'
            }
        })
        expect(wrapper.text()).toContain('データのデータの取得に失敗しました。リロードしてください')
    })

    it('エラーがない場合はエラーメッセージが表示されない', () => {
        const wrapper = mount(GenreSection, {
            props: {
                genres: [],
                error: null
            }
        })
        expect(wrapper.text()).not.toContain('データのデータの取得に失敗しました。リロードしてください')
    })
})
