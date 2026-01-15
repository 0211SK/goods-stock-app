import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import StatsFilterBar from '../../../app/components/stats/StatsFilterBar.vue'

describe('StatsFilterBar.vue', () => {
    const defaultProps = {
        selectedYear: '',
        selectedMonth: '',
        availableYears: [2024, 2023, 2022],
    }

    beforeEach(() => {
        // 各テスト前のクリーンアップ
    })

    describe('セレクトボックスの表示', () => {
        it('年セレクトボックスが表示される', () => {
            const wrapper = mount(StatsFilterBar, {
                props: defaultProps,
            })

            const yearSelect = wrapper.find('#year-select')
            expect(yearSelect.exists()).toBe(true)
        })

        it('月セレクトボックスが表示される', () => {
            const wrapper = mount(StatsFilterBar, {
                props: defaultProps,
            })

            const monthSelect = wrapper.find('#month-select')
            expect(monthSelect.exists()).toBe(true)
        })

        it('フィルタークリアボタンが表示される', () => {
            const wrapper = mount(StatsFilterBar, {
                props: defaultProps,
            })

            const clearButton = wrapper.find('.clear-button')
            expect(clearButton.exists()).toBe(true)
            expect(clearButton.text()).toBe('フィルタークリア')
        })
    })

    describe('年セレクトボックス', () => {
        it('「すべて」オプションが表示される', () => {
            const wrapper = mount(StatsFilterBar, {
                props: defaultProps,
            })

            const yearSelect = wrapper.find('#year-select')
            const options = yearSelect.findAll('option')
            expect(options[0].text()).toBe('すべて')
            expect(options[0].element.value).toBe('')
        })

        it('availableYearsが正しく表示される', () => {
            const wrapper = mount(StatsFilterBar, {
                props: defaultProps,
            })

            const yearSelect = wrapper.find('#year-select')
            const options = yearSelect.findAll('option')

            // すべて + 3年分
            expect(options).toHaveLength(4)
            expect(options[1].text()).toBe('2024年')
            expect(options[1].element.value).toBe('2024')
            expect(options[2].text()).toBe('2023年')
            expect(options[2].element.value).toBe('2023')
            expect(options[3].text()).toBe('2022年')
            expect(options[3].element.value).toBe('2022')
        })

        it('selectedYear propが反映される', () => {
            const wrapper = mount(StatsFilterBar, {
                props: { ...defaultProps, selectedYear: '2023' },
            })

            const yearSelect = wrapper.find('#year-select')
            expect((yearSelect.element as HTMLSelectElement).value).toBe('2023')
        })

        it('年の変更でupdate:selectedYearイベントが発火する', async () => {
            const wrapper = mount(StatsFilterBar, {
                props: defaultProps,
            })

            const yearSelect = wrapper.find('#year-select')
            await yearSelect.setValue('2024')

            expect(wrapper.emitted('update:selectedYear')).toBeTruthy()
            expect(wrapper.emitted('update:selectedYear')?.[0]).toEqual(['2024'])
        })

        it('availableYearsが空の場合は「すべて」のみ表示される', () => {
            const wrapper = mount(StatsFilterBar, {
                props: { ...defaultProps, availableYears: [] },
            })

            const yearSelect = wrapper.find('#year-select')
            const options = yearSelect.findAll('option')
            expect(options).toHaveLength(1)
            expect(options[0].text()).toBe('すべて')
        })
    })

    describe('月セレクトボックス', () => {
        it('「すべて」オプションが表示される', () => {
            const wrapper = mount(StatsFilterBar, {
                props: defaultProps,
            })

            const monthSelect = wrapper.find('#month-select')
            const options = monthSelect.findAll('option')
            expect(options[0].text()).toBe('すべて')
            expect(options[0].element.value).toBe('')
        })

        it('1月から12月までのオプションが表示される', () => {
            const wrapper = mount(StatsFilterBar, {
                props: defaultProps,
            })

            const monthSelect = wrapper.find('#month-select')
            const options = monthSelect.findAll('option')

            // すべて + 12ヶ月
            expect(options).toHaveLength(13)

            for (let i = 1; i <= 12; i++) {
                expect(options[i].text()).toBe(`${i}月`)
                expect(options[i].element.value).toBe(String(i))
            }
        })

        it('selectedMonth propが反映される', () => {
            const wrapper = mount(StatsFilterBar, {
                props: { ...defaultProps, selectedMonth: '6' },
            })

            const monthSelect = wrapper.find('#month-select')
            expect((monthSelect.element as HTMLSelectElement).value).toBe('6')
        })

        it('月の変更でupdate:selectedMonthイベントが発火する', async () => {
            const wrapper = mount(StatsFilterBar, {
                props: defaultProps,
            })

            const monthSelect = wrapper.find('#month-select')
            await monthSelect.setValue('3')

            expect(wrapper.emitted('update:selectedMonth')).toBeTruthy()
            expect(wrapper.emitted('update:selectedMonth')?.[0]).toEqual(['3'])
        })
    })

    describe('フィルタークリア', () => {
        it('クリアボタンのクリックでclear-filtersイベントが発火する', async () => {
            const wrapper = mount(StatsFilterBar, {
                props: defaultProps,
            })

            const clearButton = wrapper.find('.clear-button')
            await clearButton.trigger('click')

            expect(wrapper.emitted('clear-filters')).toBeTruthy()
            expect(wrapper.emitted('clear-filters')?.length).toBe(1)
        })
    })

    describe('ラベルの表示', () => {
        it('年のラベルが正しく表示される', () => {
            const wrapper = mount(StatsFilterBar, {
                props: defaultProps,
            })

            const yearLabel = wrapper.find('label[for="year-select"]')
            expect(yearLabel.exists()).toBe(true)
            expect(yearLabel.text()).toBe('年：')
        })

        it('月のラベルが正しく表示される', () => {
            const wrapper = mount(StatsFilterBar, {
                props: defaultProps,
            })

            const monthLabel = wrapper.find('label[for="month-select"]')
            expect(monthLabel.exists()).toBe(true)
            expect(monthLabel.text()).toBe('月：')
        })
    })

    describe('複数の操作', () => {
        it('年と月を連続して変更できる', async () => {
            const wrapper = mount(StatsFilterBar, {
                props: defaultProps,
            })

            const yearSelect = wrapper.find('#year-select')
            const monthSelect = wrapper.find('#month-select')

            await yearSelect.setValue('2024')
            await monthSelect.setValue('5')

            expect(wrapper.emitted('update:selectedYear')?.[0]).toEqual(['2024'])
            expect(wrapper.emitted('update:selectedMonth')?.[0]).toEqual(['5'])
        })

        it('選択後にクリアボタンを押せる', async () => {
            const wrapper = mount(StatsFilterBar, {
                props: { ...defaultProps, selectedYear: '2024', selectedMonth: '5' },
            })

            const clearButton = wrapper.find('.clear-button')
            await clearButton.trigger('click')

            expect(wrapper.emitted('clear-filters')).toBeTruthy()
        })
    })

    describe('初期値の反映', () => {
        it('selectedYearとselectedMonthが両方設定されている場合、両方反映される', () => {
            const wrapper = mount(StatsFilterBar, {
                props: { ...defaultProps, selectedYear: '2023', selectedMonth: '7' },
            })

            const yearSelect = wrapper.find('#year-select')
            const monthSelect = wrapper.find('#month-select')

            expect((yearSelect.element as HTMLSelectElement).value).toBe('2023')
            expect((monthSelect.element as HTMLSelectElement).value).toBe('7')
        })

        it('初期値が空の場合、「すべて」が選択される', () => {
            const wrapper = mount(StatsFilterBar, {
                props: { ...defaultProps, selectedYear: '', selectedMonth: '' },
            })

            const yearSelect = wrapper.find('#year-select')
            const monthSelect = wrapper.find('#month-select')

            expect((yearSelect.element as HTMLSelectElement).value).toBe('')
            expect((monthSelect.element as HTMLSelectElement).value).toBe('')
        })
    })
})
