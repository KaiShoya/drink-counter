export interface DrinkLabel {
  id: number
  name: string
  user_id: string
  sort: number | null
  color: string | null
  default_color: string
  standard_amount: number
  visible: boolean
  created_at: string // Datetime
  default_drink_id: number | null
}
