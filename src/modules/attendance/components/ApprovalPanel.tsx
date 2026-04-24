"use client"
import * as React from 'react'
import { SectionCard, Button, StatusBadge } from '@hryantra/ui'
import { useStore } from '@/store/StoreProvider'

export function ApprovalPanel() {
  const { remoteRequests, updateRequestStatus, employees } = useStore()
  
  const pendingRequests = remoteRequests.filter(r => r.status === 'Pending')

  return (
    <SectionCard title="Pending Approvals">
      <div className="flex flex-col gap-3">
        {pendingRequests.length === 0 && (
          <span className="text-ds-body-sm text-ds-neutral-500 py-4">No pending requests.</span>
        )}
        
        {pendingRequests.map(req => {
          const emp = employees.find(e => e.id === req.employeeId)
          return (
            <div key={req.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 border border-ds-neutral-200 rounded-lg shadow-sm gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-ds-body font-semibold text-ds-brand-navy">{emp?.name || req.employeeId}</span>
                  <span className="text-ds-caption text-ds-neutral-500">requested remote work for</span>
                  <span className="text-ds-body-sm font-medium">{new Date(req.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-ds-body-sm text-ds-neutral-600">
                  <span className="font-medium">Location:</span> {req.location}
                </div>
                <div className="text-ds-caption text-ds-neutral-500 italic mt-1 line-clamp-2 max-w-lg">
                  "{req.purpose}"
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => updateRequestStatus(req.id, 'Rejected')}>
                  Reject
                </Button>
                <Button variant="primary" size="sm" onClick={() => updateRequestStatus(req.id, 'Approved')}>
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
