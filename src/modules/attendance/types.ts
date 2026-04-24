export type AttendanceMode = 'office' | 'remote'
export type AttendanceStatus = 'Present' | 'Late' | 'Half-day' | 'Absent' | 'On Leave'
export type RequestStatus = 'Pending' | 'Approved' | 'Rejected'

export type AttendanceRecord = {
  id: string
  employeeId: string
  date: string // YYYY-MM-DD local time string
  checkIn: string | null // ISO string
  checkOut: string | null // ISO string
  mode: AttendanceMode
  status: AttendanceStatus
  location?: string
  flags?: string[] // e.g. 'late', 'early_exit', 'override'
}

export type RemoteRequest = {
  id: string
  employeeId: string
  date: string
  purpose: string
  location: string
  status: RequestStatus
  createdAt: string
}
