import { LeaveRequest } from '../types'

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'LV-001',
    employeeId: 'EMP-001',
    type: 'Sick',
    startDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0],
    endDate: new Date(new Date().setDate(new Date().getDate() - 9)).toISOString().split('T')[0],
    totalDays: 2,
    reason: 'Viral fever and prescribed rest',
    status: 'Approved',
    approverId: 'EMP-000',
    remarks: 'Get well soon',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 12)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 11)).toISOString()
  },
  {
    id: 'LV-002',
    employeeId: 'EMP-003',
    type: 'Casual',
    startDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
    endDate: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString().split('T')[0],
    totalDays: 2,
    reason: 'Family function out of town',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'LV-003',
    employeeId: 'EMP-004',
    type: 'Earned',
    startDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0],
    endDate: new Date(new Date().setDate(new Date().getDate() + 19)).toISOString().split('T')[0],
    totalDays: 5,
    reason: 'Annual vacation',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]
