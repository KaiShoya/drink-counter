const loading = ref<boolean>(false)
const lastInput = ref<AnnualSummaryInput | null>(null)
const data = ref<AnnualSummaryOutput | null>(null)
const error = ref<string | null>(null)

export const useAnnualSummaryState = () => {
  return {
    loading,
    lastInput,
    data,
    error,
  }
}
