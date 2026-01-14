<template>
    <CommonPageLayout title="設定">
        <div class="settings-menu">
            <NuxtLink to="/settings/works" class="menu-card">
                <div class="menu-icon">📚</div>
                <div class="menu-content">
                    <h3>作品管理</h3>
                    <p>作品の登録・編集・削除</p>
                </div>
            </NuxtLink>

            <NuxtLink to="/settings/item-types" class="menu-card">
                <div class="menu-icon">🏷️</div>
                <div class="menu-content">
                    <h3>種類管理</h3>
                    <p>グッズ種類の登録・編集・削除</p>
                </div>
            </NuxtLink>
        </div>
    </CommonPageLayout>

</template>

<script setup lang="ts">
import CommonPageLayout from '~/components/common/CommonPageLayout.vue'
</script>

<style scoped>
/** 設定メニューのコンテナ */
.settings-menu {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 600px;
    margin: 24px auto;
}

/** メニューカード */
.menu-card {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 24px;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s;
}

.menu-card:hover {
    background: #f5f5f5;
    border-color: #999;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/** アイコン */
.menu-icon {
    font-size: 40px;
    line-height: 1;
}

/** コンテンツ */
.menu-content h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
}

.menu-content p {
    margin: 0;
    font-size: 14px;
    color: #666;
}

@media (max-width: 480px) {
    .menu-card {
        padding: 20px;
        gap: 16px;
    }

    .menu-icon {
        font-size: 32px;
    }

    .menu-content h3 {
        font-size: 16px;
    }

    .menu-content p {
        font-size: 13px;
    }
}
</style>
