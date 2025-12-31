// 既存ページは旧monthlyStoreを使用しているが、新しい月次集計も併用して試せるように追加
export const useMonthlySummaryActions = () => {
  const { loading, error, lastInput, data } = useMonthlySummaryState()

  const fetchMonthlySummary = async (input: MonthlySummaryInput) => {
    loading.value = true
    error.value = null
    lastInput.value = input
    try {
      // 1) 前提データの取得
      const drinksStore = useDrinksStore()
      const drinkLabelsStore = useDrinkLabelsStore()
      const { fetchDrinks } = drinksStore
      const { fetchDrinkLabels } = drinkLabelsStore
      await Promise.all([fetchDrinks(), fetchDrinkLabels()])

      const { userSetting } = storeToRefs(useUserStore())
      const { $drinkCountersRepository } = useNuxtApp()

      // 2) 期間計算（YYYY-MM -> [start, nextStart)）
      const [yearStr, monthStr] = input.month.split('-')
      const year = Number(yearStr)
      const month = Number(monthStr) // 1-12
      const start = `${yearStr}-${monthStr}-01`
      const next = (() => {
        const d = new Date(year, month, 1) // monthは1-12、Dateはmonth+1扱い
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        return `${y}-${m}-01`
      })()
      const daysInMonth = new Date(year, month, 0).getDate()
      const end = `${yearStr}-${monthStr}-${String(daysInMonth).padStart(2, '0')}`

      // 3) データ取得（当月）
      const counters = await $drinkCountersRepository.fetchByPeriod(start, next)

      // 4) フィルタ準備（drink/label可視・labelIds）
      const drinks = drinksStore.findDrinksVisible ? (
        input.filters?.visibility === 'visible' ? drinksStore.findDrinksVisible() : drinksStore.drinks
      ) : drinksStore.drinks
      // drinksStore.drinks は state の ref。型を緩く扱う
      const allDrinks: any[] = (Array.isArray(drinks) ? drinks : (drinks as any).value) ?? []
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

      // 5) 集計（dense calendar, by label, KPI）
      type DayAgg = { count: number; volumeMl: number; labelCounts: Record<string, number>; labelVolumes: Record<string, number> }
      const dayAgg = new Map<string, DayAgg>()
      const labelTotals = new Map<string, { count: number; volumeMl: number }>()
      let totalDrinks = 0
      let totalVolumeMl = 0

      const addToLabel = (labelId: string, count: number, volumeMl: number) => {
        const cur = labelTotals.get(labelId) || { count: 0, volumeMl: 0 }
        cur.count += count
        cur.volumeMl += volumeMl
        labelTotals.set(labelId, cur)
      }

      for (const c of counters) {
        if (!isAllowedDrink(c.drink_id)) continue
        const drink = drinkById.get(c.drink_id)
        const amount = Number(drink?.amount ?? 0)
        const vol = amount * c.count
        const labelId = String(drink?.drink_label_id ?? 'unknown')

        const d = dayAgg.get(c.date) || { count: 0, volumeMl: 0, labelCounts: {}, labelVolumes: {} }
        d.count += c.count
        d.volumeMl += vol
        d.labelCounts[labelId] = (d.labelCounts[labelId] || 0) + c.count
        d.labelVolumes[labelId] = (d.labelVolumes[labelId] || 0) + vol
        dayAgg.set(c.date, d)

        addToLabel(labelId, c.count, vol)
        totalDrinks += c.count
        totalVolumeMl += vol
      }

      // 6) カレンダー（ゼロ埋め）と日次系列
      const pad2 = (n: number) => String(n).padStart(2, '0')
      const calendar = Array.from({ length: daysInMonth }).map((_, i) => {
        const date = `${yearStr}-${monthStr}-${pad2(i + 1)}`
        const agg = dayAgg.get(date) || { count: 0, volumeMl: 0, labelCounts: {}, labelVolumes: {} }
        // topLabelId の決定
        let topLabelId: string | undefined
        let maxCount = -1
        for (const [lid, cnt] of Object.entries(agg.labelCounts)) {
          if (cnt > maxCount) { maxCount = cnt; topLabelId = lid }
        }
        const threshold = userSetting.value.threshold_for_detecting_overdrinking
        const overGoal = agg.count > threshold
        return { date, count: agg.count, volumeMl: agg.volumeMl, topLabelId: topLabelId ? (Number.isNaN(Number(topLabelId)) ? undefined : Number(topLabelId)) : undefined, overGoal }
      })

      const dailySeries = calendar.map((c) => {
        const agg = dayAgg.get(c.date) || { count: 0, volumeMl: 0, labelCounts: {}, labelVolumes: {} }
        const byLabel: Record<string, { count: number; volumeMl: number }> = {}
        for (const lid of Object.keys(agg.labelCounts)) {
          byLabel[lid] = { count: agg.labelCounts[lid] ?? 0, volumeMl: agg.labelVolumes[lid] ?? 0 }
        }
        return { date: c.date, byLabel, total: { count: c.count, volumeMl: c.volumeMl } }
      })

      // 7) ドーナツ
      const labelDonut = Array.from(labelTotals.entries()).map(([labelId, v]) => ({ labelId: isNaN(Number(labelId)) ? labelId : Number(labelId), count: v.count, volumeMl: v.volumeMl }))

      // 8) 平均（曜日別/ラベル別）
      const weekdayAgg = new Array(7).fill(0).map(() => ({ sumCount: 0, sumVolume: 0, days: 0 }))
      calendar.forEach((c) => {
        const dow = new Date(c.date).getDay()
        if (weekdayAgg[dow]) {
          weekdayAgg[dow].sumCount += c.count
          weekdayAgg[dow].sumVolume += c.volumeMl
          weekdayAgg[dow].days += 1
        }
      })
      const byWeekday = weekdayAgg.map((w, i) => ({ weekday: i, countAvg: w.days ? Number((w.sumCount / w.days).toFixed(2)) : 0, volumeAvgMl: w.days ? Number((w.sumVolume / w.days).toFixed(2)) : 0 }))

      const byLabel = Array.from(labelTotals.entries()).map(([labelId, v]) => ({
        labelId,
        countAvg: Number((v.count / daysInMonth).toFixed(2)),
        volumeAvgMl: Number((v.volumeMl / daysInMonth).toFixed(2)),
        sharePct: totalDrinks ? Number(((v.count / totalDrinks) * 100).toFixed(1)) : 0,
      }))

      // 9) KPI
      const activeDays = calendar.reduce((acc, c) => acc + (c.count > 0 ? 1 : 0), 0)
      const avgPerCalendarDay = daysInMonth ? Number((totalDrinks / daysInMonth).toFixed(2)) : 0
      const avgPerActiveDay = activeDays ? Number((totalDrinks / activeDays).toFixed(2)) : 0

      // 前月比（同フィルタで算出）
      const prevStart = (() => {
        const d = new Date(year, month - 2, 1) // 前月の1日（month-1 の更に -1 で 0-based）
        const y = d.getFullYear(); const m = String(d.getMonth() + 1).padStart(2, '0')
        return `${y}-${m}-01`
      })()
      const prevNext = start // 当月開始が前月のnext

      const prevCounters = await $drinkCountersRepository.fetchByPeriod(prevStart, prevNext)

      let prevTotalDrinks = 0
      if (prevCounters) {
        for (const c of prevCounters) {
          if (!isAllowedDrink(c.drink_id)) continue
          prevTotalDrinks += c.count
        }
      }
      // 前月が0の場合の扱い: 現月も0なら0%、現月>0なら算出不能としてundefined
      const momChangePct: number | undefined = (() => {
        if (prevTotalDrinks === 0) {
          return totalDrinks === 0 ? 0 : undefined
        }
        return Number((((totalDrinks - prevTotalDrinks) / prevTotalDrinks) * 100).toFixed(1))
      })()

      const output: MonthlySummaryOutput = {
        period: { start, end, days: daysInMonth },
        kpi: {
          totalDrinks,
          totalVolumeMl: Number(totalVolumeMl.toFixed(0)),
          activeDays,
          avgPerCalendarDay,
          avgPerActiveDay,
          momChangePct,
        },
        calendar,
        dailySeries,
        labelDonut,
        averages: { byWeekday, byLabel },
        meta: { unit: 'ml', denseCalendar: true },
      }

      data.value = output
    } catch (e: any) {
      error.value = e?.message ?? String(e)
    } finally {
      loading.value = false
    }
  }

  return {
    fetchMonthlySummary,
  }
}
