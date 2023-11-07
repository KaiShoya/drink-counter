export interface Drink {
  id: number
  name: string
  user_id: string
  sort: number | null
  color: string | null
  visible: boolean
  created_at: Date // Datetime
}
