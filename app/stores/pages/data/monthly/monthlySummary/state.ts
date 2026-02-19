const loading = ref<boolean>(false)
const lastInput = ref<MonthlySummaryInput | null>(null)
const data = ref<MonthlySummaryOutput | null>(null)
const error = ref<string | null>(null)

export function useMonthlySummaryState () {
  return {
    loading,
    lastInput,
    data,
    error,
  }
}
