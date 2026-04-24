export type TaskStatus = "todo" | "in_progress" | "blocked" | "completed"

export type TaskPriority = "low" | "medium" | "high" | "urgent"

export type Task = {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignee: {
    id: string
    name: string
    avatarUrl?: string
  }
  assignedBy: string
  dueDate: string
  estimatedHours?: number
  timeLogged?: number
  tags?: string[]
  createdAt: string
  completedAt?: string
}
