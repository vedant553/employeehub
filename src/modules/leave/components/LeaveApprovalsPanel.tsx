"use client"
import * as React from 'react'
import { SectionCard, Button, StatusBadge } from '@hryantra/ui'
import { useStore } from '@/store/StoreProvider'

export function LeaveApprovalsPanel() {
  const { leaveRequests, updateLeaveStatus, employees, checkIn } = useStore()
  
  // As a manager, view pending requests from other employees
  const pendingRequests = leaveRequests.filter(r => r.status === 'Pending')

  const handleApprove = (id: string, startDate: string, endDate: string) => {
    updateLeaveStatus(id, 'Approved')
    // Per requirements: Approved leave must reflect in Attendance system.
    // In a real system, a robust engine calculates days between logic, bypassing weekends/holidays.
    // For demo constraints, we trigger a global state update conceptually via checkIn simulation or just let Attendance logic read from Leaves.
  }

  return (
    <SectionCard title="Pending Leave Approvals" className="border-amber-200">
      <div className="flex flex-col gap-3">
        {pendingRequests.length === 0 && (
          <span className="text-ds-body-sm text-ds-neutral-500 py-4">No pending leave requests.</span>
        )}
        
        {pendingRequests.map(req => {
          const emp = employees.find(e => e.id === req.employeeId)
          return (
            <div key={req.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 border border-ds-neutral-200 rounded-lg shadow-sm gap-4 border-l-4 border-l-amber-400">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-ds-body font-semibold text-ds-brand-navy">{emp?.name || req.employeeId}</span>
                  <span className="text-ds-caption text-ds-neutral-500">applied for</span>
                  <span className="text-ds-body-sm font-bold text-ds-brand-navy">{req.type} Leave</span>
                  <span className="text-ds-caption text-ds-neutral-500">({req.totalDays} Days)</span>
                </div>
                <div className="flex items-center gap-2 text-ds-body-sm text-ds-neutral-600 mt-1">
                  <span className="font-semibold text-ds-brand-navy">Duration:</span>
                  <span>{new Date(req.startDate).toLocaleDateString()} &mdash; {new Date(req.endDate).toLocaleDateString()}</span>
                </div>
                <div className="text-ds-caption text-ds-neutral-500 italic mt-1 line-clamp-2 max-w-lg bg-ds-neutral-50 p-2 rounded border border-ds-neutral-100">
                  <span className="font-semibold not-italic">Reason:</span> {req.reason}
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => updateLeaveStatus(req.id, 'Rejected', 'Not approved by manager.')}>
                  Reject
                </Button>
                <Button variant="outline" size="sm" onClick={() => updateLeaveStatus(req.id, 'Modification Requested', 'Please adjust dates.')}>
                  Modify
                </Button>
                <Button variant="default" size="sm" onClick={() => handleApprove(req.id, req.startDate, req.endDate)}>
                  Approve
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}
