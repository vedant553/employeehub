export type Employee = {
  id: string
  name: string
  email: string
  designation: string
  department: string
  status: "Active" | "Inactive" | "On Leave"
  manager: string
  avatarUrl?: string
}
