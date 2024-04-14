export interface DrinkLabel {
  id: number
  name: string
  user_id: string
  sort: number | null
  color: string | null
  default_color: string
  standard_amount: number | null
  visible: boolean
  created_at: Date // Datetime
}
