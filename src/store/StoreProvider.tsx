"use client"
import * as React from 'react'
import { Task } from '../modules/tasks/types'
import { Employee } from '../modules/employees/types'
import { AttendanceRecord, RemoteRequest } from '../modules/attendance/types'
import { LeaveRequest } from '../modules/leave/types'
import { PerformanceReview } from '../modules/performance/types'
import { Asset, AssetAllocation, AssetCondition } from '../modules/assets/types'
import { Document, DocumentCategory } from '../modules/documents/types'
import { mockEmployees } from '../modules/employees/data/employees.mock'
import { mockTasks } from '../modules/tasks/data/tasks.mock'
import { mockAttendanceRecords, mockRemoteRequests } from '../modules/attendance/data/attendance.mock'
import { mockLeaveRequests } from '../modules/leave/data/leave.mock'
import { mockPerformanceReviews } from '../modules/performance/data/performance.mock'
import { mockAssets, mockAssetAllocations } from '../modules/assets/data/assets.mock'
import { mockDocuments } from '../modules/documents/data/documents.mock'
import { AppNotification } from '../modules/notifications/types'

export type UserRole = 'Employee' | 'Manager' | 'HR'

export const CURRENT_USER_ID = 'EMP-001'

interface StoreContextValue {
  employees: Employee[]
  tasks: Task[]
  attendanceRecords: AttendanceRecord[]
  remoteRequests: RemoteRequest[]
  leaveRequests: LeaveRequest[]
  performanceReviews: PerformanceReview[]
  assets: Asset[]
  assetAllocations: AssetAllocation[]
  documents: Document[]
  notifications: AppNotification[]
  currentUserRole: UserRole
  
  // Role Actions
  switchRole: (role: UserRole) => void

  // Notification Actions
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  
  // Attendance Actions
  checkIn: (mode: 'office' | 'remote', location?: string) => void
  checkOut: () => void
  submitRemoteRequest: (request: Omit<RemoteRequest, 'id' | 'status' | 'createdAt' | 'employeeId'>) => void
  updateRequestStatus: (id: string, status: 'Approved' | 'Rejected') => void
  
  // Leave Actions
  applyForLeave: (request: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'employeeId'>) => void
  updateLeaveStatus: (id: string, status: 'Approved' | 'Rejected' | 'Modification Requested', remarks?: string) => void

  // Performance Actions
  submitSelfReview: (reviewId: string, rating: number, comments: string) => void
  submitManagerReview: (reviewId: string, rating: number, feedback: string) => void

  // Asset Actions
  addAsset: (asset: Omit<Asset, 'id'>) => void
  assignAsset: (assetId: string, employeeId: string, opts: { conditionOnIssue: AssetCondition; expectedReturn?: string; notes?: string }) => void
  returnAsset: (allocationId: string, conditionOnReturn: AssetCondition, notes?: string) => void

  // Document Actions
  addDocument: (doc: Omit<Document, 'id' | 'uploadedAt' | 'uploadedBy' | 'status' | 'size' | 'url'>) => void
  archiveDocument: (id: string) => void
}

const StoreContext = React.createContext<StoreContextValue | null>(null)

export function useStore() {
  const context = React.useContext(StoreContext)
  if (!context) throw new Error("useStore must be used within StoreProvider")
  return context
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = React.useState<Employee[]>(mockEmployees)
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks)
  const [attendanceRecords, setAttendanceRecords] = React.useState<AttendanceRecord[]>(mockAttendanceRecords)
  const [remoteRequests, setRemoteRequests] = React.useState<RemoteRequest[]>(mockRemoteRequests)
  const [leaveRequests, setLeaveRequests] = React.useState<LeaveRequest[]>(mockLeaveRequests)
  const [performanceReviews, setPerformanceReviews] = React.useState<PerformanceReview[]>(mockPerformanceReviews)
  const [assets, setAssets] = React.useState<Asset[]>(mockAssets)
  const [assetAllocations, setAssetAllocations] = React.useState<AssetAllocation[]>(mockAssetAllocations)
  const [documents, setDocuments] = React.useState<Document[]>(mockDocuments)
  const [notifications, setNotifications] = React.useState<AppNotification[]>([
    {
      id: 'NT-1',
      type: 'task',
      title: 'New Task Assigned',
      description: 'You have been assigned to: Update Compliance Documents',
      userId: CURRENT_USER_ID,
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1h ago
      relatedPath: '/tasks'
    },
    {
      id: 'NT-2',
      type: 'leave',
      title: 'Leave Approved',
      description: 'Your leave request for Annual Vacation has been approved.',
      userId: CURRENT_USER_ID,
      isRead: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1d ago
      relatedPath: '/leave'
    },
    {
      id: 'NT-3',
      type: 'attendance',
      title: 'Late Check-in',
      description: 'You checked in 20 minutes late today.',
      userId: CURRENT_USER_ID,
      isRead: false,
      createdAt: new Date().toISOString(),
      relatedPath: '/attendance'
    }
  ])

  const [currentUserRole, setCurrentUserRole] = React.useState<UserRole>('HR') // Default to HR for full access during dev

  const switchRole = React.useCallback((role: UserRole) => {
    setCurrentUserRole(role)
  }, [])

  const addNotification = React.useCallback((type: AppNotification['type'], title: string, description: string, relatedPath?: string) => {
    setNotifications(prev => [
      {
        id: `NT-${Date.now()}`,
        type,
        title,
        description,
        userId: CURRENT_USER_ID,
        isRead: false,
        createdAt: new Date().toISOString(),
        relatedPath
      },
      ...prev
    ])
  }, [])

  const addTask = React.useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    setTasks(prev => {
      const newTask: Task = {
        ...taskData,
        id: `TSK-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        createdAt: new Date().toISOString()
      }
      addNotification('task', 'New Task Assigned', `You have been assigned to: ${taskData.title}`, '/tasks')
      return [newTask, ...prev]
    })
  }, [addNotification])

  const updateTask = React.useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updates }
        if (updates.status === 'completed' && !t.completedAt) {
          updated.completedAt = new Date().toISOString()
          addNotification('task', 'Task Completed', `You finished: ${t.title}`, '/tasks')
        }
        return updated
      }
      return t
    }))
  }, [addNotification])

  const deleteTask = React.useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  // Check in logic
  const checkIn = React.useCallback((mode: 'office' | 'remote', location?: string) => {
    const today = new Date().toISOString().split('T')[0]
    setAttendanceRecords(prev => {
      if (prev.find(r => r.date === today && r.employeeId === CURRENT_USER_ID)) return prev // already exists
      
      const now = new Date()
      const isLate = now.getHours() >= 9 && now.getMinutes() > 15
      
      const newRecord: AttendanceRecord = {
        id: `ATT-${Date.now()}`,
        employeeId: CURRENT_USER_ID,
        date: today,
        checkIn: now.toISOString(),
        checkOut: null,
        mode,
        status: isLate ? 'Late' : 'Present',
        location,
        flags: isLate ? ['late'] : []
      }
      if (isLate) {
        addNotification('attendance', 'Late Check-in', 'Your check-in was marked as late today.', '/attendance')
      }
      return [newRecord, ...prev]
    })
  }, [addNotification])

  const checkOut = React.useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    setAttendanceRecords(prev => prev.map(r => {
      if (r.date === today && r.employeeId === CURRENT_USER_ID && !r.checkOut) {
        return { ...r, checkOut: new Date().toISOString() }
      }
      return r
    }))
  }, [])

  const submitRemoteRequest = React.useCallback((requestData: Omit<RemoteRequest, 'id' | 'status' | 'createdAt' | 'employeeId'>) => {
    setRemoteRequests(prev => [
      {
        ...requestData,
        id: `REQ-${Date.now()}`,
        employeeId: CURRENT_USER_ID,
        status: 'Pending',
        createdAt: new Date().toISOString()
      },
      ...prev
    ])
    addNotification('attendance', 'Remote Request Submitted', `Requested remote work for ${requestData.date}`, '/attendance')
  }, [addNotification])

  const updateRequestStatus = React.useCallback((id: string, status: 'Approved' | 'Rejected') => {
    setRemoteRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }, [])

  const applyForLeave = React.useCallback((requestData: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'employeeId'>) => {
    setLeaveRequests(prev => [
      {
        ...requestData,
        id: `LV-${Date.now()}`,
        employeeId: CURRENT_USER_ID,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      ...prev
    ])
    addNotification('leave', 'Leave Application Submitted', `Applied for ${requestData.type} leave.`, '/leave')
  }, [addNotification])

  const updateLeaveStatus = React.useCallback((id: string, status: 'Approved' | 'Rejected' | 'Modification Requested', remarks?: string) => {
    setLeaveRequests(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, status, remarks, updatedAt: new Date().toISOString(), approverId: 'EMP-000' }
      }
      return r
    }))
    const request = leaveRequests.find(r => r.id === id)
    if (request) {
      addNotification('leave', `Leave ${status}`, `Your leave request for ${request.type} has been ${status.toLowerCase()}.`, '/leave')
    }
  }, [addNotification, leaveRequests])

  const submitSelfReview = React.useCallback((reviewId: string, rating: number, comments: string) => {
    setPerformanceReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          status: 'Pending Manager Review',
          selfAssessment: {
            submittedAt: new Date().toISOString(),
            rating,
            comments
          }
        }
      }
      return r
    }))
  }, [])

  const submitManagerReview = React.useCallback((reviewId: string, rating: number, feedback: string) => {
    setPerformanceReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        const managerScore = rating * 20 // Convert 1-5 to 1-100
        const newFinalScore = Math.round(r.metrics.taskScore * 0.4 + r.metrics.attendanceScore * 0.2 + r.metrics.leaveScore * 0.2 + managerScore * 0.2)
        
        let category: 'Needs Improvement' | 'Meets Expectations' | 'Exceeds Expectations' | 'Outstanding' = 'Needs Improvement'
        if (newFinalScore >= 90) category = 'Outstanding'
        else if (newFinalScore >= 75) category = 'Exceeds Expectations'
        else if (newFinalScore >= 60) category = 'Meets Expectations'

        return {
          ...r,
          status: 'Completed',
          managerAssessment: {
            submittedAt: new Date().toISOString(),
            managerId: CURRENT_USER_ID,
            rating,
            feedback
          },
          metrics: {
            ...r.metrics,
            managerScore,
            finalScore: newFinalScore,
            category
          }
        }
      }
      return r
    }))
  }, [])

  const addAsset = React.useCallback((assetData: Omit<Asset, 'id'>) => {
    setAssets(prev => [{ ...assetData, id: `AST-${Date.now()}` }, ...prev])
  }, [])

  const assignAsset = React.useCallback((assetId: string, employeeId: string, opts: { conditionOnIssue: AssetCondition; expectedReturn?: string; notes?: string }) => {
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, status: 'Assigned' } : a))
    setAssetAllocations(prev => [
      {
        id: `ALLOC-${Date.now()}`,
        assetId,
        employeeId,
        issuedOn: new Date().toISOString().split('T')[0],
        issuedBy: CURRENT_USER_ID,
        status: 'Active',
        conditionOnIssue: opts.conditionOnIssue,
        expectedReturn: opts.expectedReturn,
        notes: opts.notes,
      },
      ...prev
    ])
  }, [])

  const returnAsset = React.useCallback((allocationId: string, conditionOnReturn: AssetCondition, notes?: string) => {
    const allocation = assetAllocations.find(a => a.id === allocationId)
    if (!allocation) return
    setAssetAllocations(prev => prev.map(a =>
      a.id === allocationId
        ? { ...a, status: 'Returned', returnedOn: new Date().toISOString().split('T')[0], conditionOnReturn, notes: notes ?? a.notes }
        : a
    ))
    setAssets(prev => prev.map(a =>
      a.id === allocation.assetId
        ? { ...a, status: conditionOnReturn === 'Damaged' ? 'In Repair' : 'Available', condition: conditionOnReturn }
        : a
    ))
  }, [assetAllocations])

  const addDocument = React.useCallback((docData: Omit<Document, 'id' | 'uploadedAt' | 'uploadedBy' | 'status' | 'size' | 'url'>) => {
    setDocuments(prev => {
      const emp = employees.find(e => e.id === docData.employeeId)
      const newDoc: Document = {
        ...docData,
        id: `DOC-${Date.now()}`,
        uploadedAt: new Date().toISOString(),
        uploadedBy: employees.find(e => e.id === CURRENT_USER_ID)?.name || 'Unknown',
        status: 'Active',
        size: '1.5 MB', // Mocked
        url: '#',
        employeeName: emp?.name
      }
      return [newDoc, ...prev]
    })
  }, [employees])

  const archiveDocument = React.useCallback((id: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'Archived' } : d))
  }, [])

  const markAsRead = React.useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
  }, [])

  const markAllAsRead = React.useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }, [])

  return (
    <StoreContext.Provider value={{ 
      employees, tasks, attendanceRecords, remoteRequests, leaveRequests, performanceReviews,
      assets, assetAllocations, documents,
      addTask, updateTask, deleteTask,
      checkIn, checkOut, submitRemoteRequest, updateRequestStatus,
      applyForLeave, updateLeaveStatus,
      submitSelfReview, submitManagerReview,
      addAsset, assignAsset, returnAsset,
      addDocument, archiveDocument,
      notifications, markAsRead, markAllAsRead,
      currentUserRole, switchRole
    }}>
      {children}
    </StoreContext.Provider>
  )
}
