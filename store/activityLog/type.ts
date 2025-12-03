/**
 * Activity log entry representing a drink counter operation
 */
export interface ActivityLogEntry {
  /** Unique identifier for the log entry */
  id: number
  /** Type of operation: 'plus' for increment, 'minus' for decrement */
  type: 'plus' | 'minus'
  /** Name of the drink */
  drinkName: string
  /** Timestamp of the operation */
  timestamp: Date
}
