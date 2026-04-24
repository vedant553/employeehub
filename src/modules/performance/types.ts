export type PerformanceCycle = 'monthly' | 'quarterly' | 'annual'

export interface PerformanceMetrics {
  taskScore: number
  attendanceScore: number
  leaveScore: number
  managerScore: number
  finalScore: number
  category: 'Needs Improvement' | 'Meets Expectations' | 'Exceeds Expectations' | 'Outstanding'
}

export interface EmployeeInsights {
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
}

export interface PerformanceReview {
  id: string
  employeeId: string
  cycle: string // e.g., '2026-Q1' or '2026-04'
  cycleType: PerformanceCycle
  metrics: PerformanceMetrics
  insights: EmployeeInsights
  selfAssessment?: {
    submittedAt: string
    rating: number // 1-5
    comments: string
  }
  managerAssessment?: {
    submittedAt: string
    managerId: string
    rating: number // 1-5
    feedback: string
  }
  status: 'Pending Self Review' | 'Pending Manager Review' | 'Completed'
}
