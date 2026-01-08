<template>
    <div class="filter-bar">
        <div class="filter-group">
            <label for="year-select" class="filter-label">年：</label>
            <select id="year-select" :value="selectedYear" @change="onYearChange" class="filter-select">
                <option value="">すべて</option>
                <option v-for="year in availableYears" :key="year" :value="year">
                    {{ year }}年
                </option>
            </select>
        </div>
        <div class="filter-group">
            <label for="month-select" class="filter-label">月：</label>
            <select id="month-select" :value="selectedMonth" @change="onMonthChange" class="filter-select">
                <option value="">すべて</option>
                <option v-for="month in 12" :key="month" :value="month">
                    {{ month }}月
                </option>
            </select>
        </div>
        <button @click="$emit('clear-filters')" class="clear-button">フィルタークリア</button>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    selectedYear: string
    selectedMonth: string
    availableYears: number[]
}>()

const emit = defineEmits<{
    'update:selectedYear': [value: string]
    'update:selectedMonth': [value: string]
    'clear-filters': []
}>()

const onYearChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    emit('update:selectedYear', target.value)
}

const onMonthChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    emit('update:selectedMonth', target.value)
}
</script>

<style scoped>
.filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    margin: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.filter-label {
    font-weight: 500;
    color: #333;
    white-space: nowrap;
}

.filter-select {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: white;
    font-size: 1rem;
    color: #333;
    cursor: pointer;
    transition: border-color 0.2s;
}

.filter-select:hover {
    border-color: #2563eb;
}

.filter-select:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.clear-button {
    padding: 0.5rem 1rem;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
}

.clear-button:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
}

.clear-button:active {
    transform: scale(0.98);
}
</style>
