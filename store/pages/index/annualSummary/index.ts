import { defineStore, storeToRefs } from 'pinia'
import type { AnnualSummaryInput, AnnualSummaryOutput } from '../../../../app/utils/types/annual'
import { useDrinksStore } from '../../../data/drinks'
import { useSupabaseStore } from '../../../supabase'
import { useUserSettingsStore } from '../../../data/userSettings'
import { Response500Error } from '../../../../app/utils/customError'

export const useAnnualSummaryStore = defineStore('pages/index/annualSummary', {
  state: () => ({
    loading: false as boolean,
    lastInput: null as AnnualSummaryInput | null,
    data: null as AnnualSummaryOutput | null,
    error: null as string | null,
  }),
  actions: {
    async fetchAnnualSummary(input: AnnualSummaryInput) {
      this.loading = true
      this.error = null
      this.lastInput = input
      try {
        const drinksStore = useDrinksStore()
        const { fetchDrinks } = drinksStore
        await fetchDrinks()

        const { supabase } = useSupabaseStore()
        const userSettingsStore = useUserSettingsStore()
        const { userSettings } = storeToRefs(userSettingsStore)

        const y = input.year
        const start = `${y}-01-01`
        const end = `${y}-12-31`
        const next = `${y + 1}-01-01`
        const daysInYear = ((): number => {
          const d1 = new Date(y, 0, 1)
          const d2 = new Date(y + 1, 0, 1)
          return Math.round((+d2 - +d1) / (24 * 60 * 60 * 1000))
        })()

        type DbDrinkCounter = { id: number; date: string; drink_id: number; count: number }
        const { data: counters, error } = await supabase
          .from('drink_counters')
          .select('id,date,drink_id,count')
          .order('date,drink_id')
          .gt('count', 0)
          .gte('date', start)
          .lt('date', next)

        if (error) throw new Response500Error()

        const countersArr: DbDrinkCounter[] = counters ?? []

        // drinkId -> drink
        const drinks = drinksStore.drinks as any
        const allDrinks: any[] = Array.isArray(drinks) ? drinks : (drinks as any).value ?? []
        const drinkById = new Map<number, any>()
        for (const d of allDrinks) drinkById.set(d.id, d)

        const allowedLabelIds = input.filters?.labelIds ? new Set(input.filters.labelIds.map((v) => String(v))) : null
        const isAllowedDrink = (drinkId: number) => {
          const drink = drinkById.get(drinkId)
          if (!drink) return false
          if (input.filters?.visibility === 'visible' && !drink.visible) return false
          if (allowedLabelIds && !allowedLabelIds.has(String(drink.drink_label_id))) return false
          return true
        }

        // aggregate
        const dayAgg = new Map<string, { count: number; volumeMl: number }>()
        let totalDrinks = 0
        let totalVolumeMl = 0
        for (const c of countersArr) {
          if (!isAllowedDrink(c.drink_id)) continue
          const drink = drinkById.get(c.drink_id)
          const amount = Number(drink?.amount ?? 0)
          const vol = amount * c.count
          const agg = dayAgg.get(c.date) || { count: 0, volumeMl: 0 }
          agg.count += c.count
          agg.volumeMl += vol
          dayAgg.set(c.date, agg)
          totalDrinks += c.count
          totalVolumeMl += vol
        }

        const activeDays = Array.from(dayAgg.values()).reduce((acc, d) => acc + (d.count > 0 ? 1 : 0), 0)
        const avgPerCalendarDay = daysInYear ? Number((totalDrinks / daysInYear).toFixed(2)) : 0
        const avgPerActiveDay = activeDays ? Number((totalDrinks / activeDays).toFixed(2)) : 0

        // YoY
        const prevStart = `${y - 1}-01-01`
        const prevNext = `${y}-01-01`
        const { data: prevCounters, error: prevErr } = await supabase
          .from('drink_counters')
          .select('drink_id,count')
          .gt('count', 0)
          .gte('date', prevStart)
          .lt('date', prevNext)
        if (prevErr) throw new Response500Error()

        let prevTotalDrinks = 0
        if (prevCounters) {
          for (const c of prevCounters as Array<{ drink_id: number; count: number }>) {
            if (!isAllowedDrink(c.drink_id)) continue
            prevTotalDrinks += c.count
          }
        }
        const yoyChangePct: number | undefined = (() => {
          if (prevTotalDrinks === 0) return totalDrinks === 0 ? 0 : undefined
          return Number((((totalDrinks - prevTotalDrinks) / prevTotalDrinks) * 100).toFixed(1))
        })()

        const output: AnnualSummaryOutput = {
          period: { start, end, days: daysInYear },
          kpi: {
            totalDrinks,
            totalVolumeMl: Number(totalVolumeMl.toFixed(0)),
            activeDays,
            avgPerCalendarDay,
            avgPerActiveDay,
            yoyChangePct,
          },
          meta: { unit: 'ml' },
        }

        this.data = output
      } catch (e: any) {
        this.error = e?.message ?? String(e)
      } finally {
        this.loading = false
      }
    },
  },
})
