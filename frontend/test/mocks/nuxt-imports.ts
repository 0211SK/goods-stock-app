// #importsのモック
export const useRouter = () => ({
    push: () => Promise.resolve(),
    replace: () => Promise.resolve(),
    back: () => { },
    forward: () => { },
})

export const navigateTo = vi.fn(() => Promise.resolve())

export const defineNuxtRouteMiddleware = (fn: any) => fn
