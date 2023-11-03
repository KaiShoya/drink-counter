export interface Drink {
  id: number
  name: string
  user_id: string
  sort: number | null
  color: number | null
  created_at: Date // Datetime
}
