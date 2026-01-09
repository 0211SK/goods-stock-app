import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from '../../../app/components/layout/AppHeader.vue'

// モック関数を定義
const mockLogout = vi.fn()
const mockRoute = { path: '/inventory' }
const mockRouter = {}

// vue-routerとuseAuthをモック
vi.mock('vue-router', () => ({
    useRoute: () => mockRoute,
    useRouter: () => mockRouter,
}))

vi.mock('../../../app/composables/useAuth', () => ({
    useAuth: () => ({
        logout: mockLogout,
    }),
}))

    // グローバルにuseAuthを追加
    ; (global as any).useAuth = () => ({
        logout: mockLogout,
    })

describe('AppHeader.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockRoute.path = '/inventory'
        delete (window as any).location
            ; (window as any).location = { href: '' }
    })

    it('header要素が存在する', () => {
        const wrapper = mount(AppHeader, {
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to" :class="$attrs.class"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        expect(wrapper.find('header.app-header').exists()).toBe(true)
    })

    it('ロゴが表示される', () => {
        const wrapper = mount(AppHeader, {
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to" :class="$attrs.class"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const logo = wrapper.find('.logo')
        expect(logo.exists()).toBe(true)
        expect(logo.text()).toBe('グッズ在庫管理')
    })

    it('ログアウトボタンが表示される', () => {
        const wrapper = mount(AppHeader, {
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to" :class="$attrs.class"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const logoutButton = wrapper.find('.logout-button')
        expect(logoutButton.exists()).toBe(true)
        expect(logoutButton.text()).toBe('ログアウト')
    })

    it('4つのタブが表示される', () => {
        const wrapper = mount(AppHeader, {
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to" :class="$attrs.class"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const tabs = wrapper.findAll('.tab')
        expect(tabs.length).toBe(4)
        expect(tabs[0].text()).toBe('グッズ検索')
        expect(tabs[1].text()).toBe('欲しいもの')
        expect(tabs[2].text()).toBe('支出予定額')
        expect(tabs[3].text()).toBe('設定')
    })

    it('グッズ検索タブが/inventoryへのリンクである', () => {
        const wrapper = mount(AppHeader, {
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to" :class="$attrs.class"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const tabs = wrapper.findAll('.tab')
        expect(tabs[0].attributes('to')).toBe('/inventory')
    })

    it('欲しいものタブが/wishlistへのリンクである', () => {
        const wrapper = mount(AppHeader, {
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to" :class="$attrs.class"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const tabs = wrapper.findAll('.tab')
        expect(tabs[1].attributes('to')).toBe('/wishlist')
    })

    it('支出予定額タブが/statsへのリンクである', () => {
        const wrapper = mount(AppHeader, {
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to" :class="$attrs.class"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const tabs = wrapper.findAll('.tab')
        expect(tabs[2].attributes('to')).toBe('/stats')
    })

    it('設定タブが/settingsへのリンクである', () => {
        const wrapper = mount(AppHeader, {
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to" :class="$attrs.class"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const tabs = wrapper.findAll('.tab')
        expect(tabs[3].attributes('to')).toBe('/settings')
    })

    it('/inventoryパスの場合グッズ検索タブがアクティブになる', () => {
        mockRoute.path = '/inventory'
        const wrapper = mount(AppHeader, {
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to" :class="$attrs.class"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const tabs = wrapper.findAll('.tab')
        expect(tabs[0].classes()).toContain('active')
    })

    it('/inventory/123パスの場合グッズ検索タブがアクティブになる', () => {
        mockRoute.path = '/inventory/123'
        const wrapper = mount(AppHeader, {
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to" :class="$attrs.class"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const tabs = wrapper.findAll('.tab')
        expect(tabs[0].classes()).toContain('active')
    })

    it('/wishlistパスの場合欲しいものタブがアクティブになる', () => {
        mockRoute.path = '/wishlist'
        const wrapper = mount(AppHeader, {
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to" :class="$attrs.class"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const tabs = wrapper.findAll('.tab')
        expect(tabs[1].classes()).toContain('active')
    })

    it('/statsパスの場合支出予定額タブがアクティブになる', () => {
        mockRoute.path = '/stats'
        const wrapper = mount(AppHeader, {
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to" :class="$attrs.class"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const tabs = wrapper.findAll('.tab')
        expect(tabs[2].classes()).toContain('active')
    })

    it('/settingsパスの場合設定タブがアクティブになる', () => {
        mockRoute.path = '/settings'
        const wrapper = mount(AppHeader, {
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to" :class="$attrs.class"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const tabs = wrapper.findAll('.tab')
        expect(tabs[3].classes()).toContain('active')
    })

    it('ログアウトボタンクリックでlogout()が呼ばれる', async () => {
        const wrapper = mount(AppHeader, {
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to" :class="$attrs.class"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const logoutButton = wrapper.find('.logout-button')
        await logoutButton.trigger('click')

        expect(mockLogout).toHaveBeenCalledTimes(1)
    })

    it('ログアウトボタンクリックでログインページにリダイレクトされる', async () => {
        mockLogout.mockResolvedValue(undefined)

        const wrapper = mount(AppHeader, {
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to" :class="$attrs.class"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const logoutButton = wrapper.find('.logout-button')
        await logoutButton.trigger('click')

        // logout()が完了するまで待つ
        await new Promise(resolve => setTimeout(resolve, 0))

        expect(window.location.href).toBe('/login')
    })

    it('header-topとheader-mainが存在する', () => {
        const wrapper = mount(AppHeader, {
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to" :class="$attrs.class"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        expect(wrapper.find('.header-top').exists()).toBe(true)
        expect(wrapper.find('.header-main').exists()).toBe(true)
    })

    it('tabsコンテナが存在する', () => {
        const wrapper = mount(AppHeader, {
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to" :class="$attrs.class"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        expect(wrapper.find('.tabs').exists()).toBe(true)
    })
})
