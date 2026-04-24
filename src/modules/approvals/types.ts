export type ApprovalType = 'Leave' | 'Remote Attendance' | 'Expense' | 'Performance'

export interface ApprovalItem {
  id: string
  originalId: string
  type: ApprovalType
  employeeId: string
  createdAt: string
  status: string
  priority: 'High' | 'Medium' | 'Low'
  details: {
    title: string
    description: string
    meta?: Record<string, any>
  }
}
