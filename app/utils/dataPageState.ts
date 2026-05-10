export type DataPageMode = 'content' | 'loading' | 'error' | 'empty'

interface ResolveDataPageModeInput {
  isFetching: boolean
  isFetched: boolean
  hasError: boolean
  totalCount: number
}

export const resolveDataPageMode = ({
  isFetching,
  isFetched,
  hasError,
  totalCount,
}: ResolveDataPageModeInput): DataPageMode => {
  if (isFetching) return 'loading'
  if (hasError) return 'error'
  if (isFetched && totalCount === 0) return 'empty'
  return 'content'
}
