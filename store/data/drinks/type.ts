export interface Drink {
  id: number
  name: string
  user_id: string
  sort: number | null
  color: string | null
  default_color: string
  visible: boolean
  created_at: Date // Datetime
  drink_label_id: number | null
  amount: number
}
