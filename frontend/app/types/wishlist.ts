// 共通型定義

export type WishlistSort =
    | 'releaseDateDesc'
    | 'releaseDateAsc'
    | 'createdAtDesc'
    | 'createdAtAsc'

export type WishlistQuery = {
    workId?: number
    itemTypeId?: number
    keyword?: string
    page?: number
    size?: number
    sort?: WishlistSort
}
