// #importsのモック
export const useRouter = () => ({
    push: () => Promise.resolve(),
    replace: () => Promise.resolve(),
    back: () => { },
    forward: () => { },
})

export const navigateTo = () => Promise.resolve()
