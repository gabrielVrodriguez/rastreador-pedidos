export interface ApiError {
  timestamp: string
  status: number
  message: string
  fields: Record<string, string>
}
