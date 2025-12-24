// 共通型定義

export type InventorySort =
    | 'purchaseDateDesc'
    | 'purchaseDateAsc'
    | 'createdAtDesc'
    | 'createdAtAsc'

export type InventoryQuery = {
    workId?: number | null
    itemTypeId?: number | null
    keyword?: string | null
    page?: number | null
    size?: number | null
    sort?: InventorySort | null
}
