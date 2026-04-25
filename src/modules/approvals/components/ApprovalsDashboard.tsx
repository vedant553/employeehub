"use client"
const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
import * as React from 'react'
import { PageHeader, SectionCard, StatusBadge, Button } from '@hryantra/ui'
import { useStore, CURRENT_USER_ID } from '@/store/StoreProvider'
import { ApprovalItem, ApprovalType } from '@/modules/approvals/types'
import { Clock, CalendarDays, CheckCircle, XCircle, AlertTriangle, MessageSquare, Filter, FileText } from 'lucide-react'
import { ApprovalDrawer } from './ApprovalDrawer'

export function ApprovalsDashboard() {
  const { 
    employees, leaveRequests, remoteRequests, performanceReviews, 
    updateLeaveStatus, updateRequestStatus, submitManagerReview,
    currentUserRole 
  } = useStore()

  if (currentUserRole === 'Employee') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <AlertTriangle className="size-16 text-ds-warning mb-4" />
        <h3 className="text-ds-heading text-ds-brand-navy">Access Restricted</h3>
        <p className="text-ds-body text-ds-neutral-500 max-w-md">You do not have the required permissions to view the unified approvals dashboard. Please contact your manager or HR administrator.</p>
      </div>
    )
  }
  
  const [filterType, setFilterType] = React.useState<ApprovalType | 'All'>('All')
  const [filterStatus, setFilterStatus] = React.useState<string>('Pending')
  const [selectedItem, setSelectedItem] = React.useState<ApprovalItem | null>(null)

  // Aggregate items
  const approvalItems: ApprovalItem[] = React.useMemo(() => {
    const items: ApprovalItem[] = []

    // Map Leave Requests
    leaveRequests.forEach(l => {
      // Determine priority: if starting within 3 days, it's High
      const daysToStart = Math.ceil((new Date(l.startDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
      const priority = daysToStart <= 3 ? 'High' : 'Medium'
      
      items.push({
        id: `agg-l-${l.id}`,
        originalId: l.id,
        type: 'Leave',
        employeeId: l.employeeId,
        createdAt: l.createdAt,
        status: l.status,
        priority: l.status === 'Pending' ? priority : 'Low',
        details: {
          title: `${l.type} Leave Request`,
          description: `${l.startDate} to ${l.endDate}`,
          meta: { reason: l.reason, days: l.totalDays }
        }
      })
    })

    // Map Remote Requests
    remoteRequests.forEach(r => {
      items.push({
        id: `agg-r-${r.id}`,
        originalId: r.id,
        type: 'Remote Attendance',
        employeeId: r.employeeId,
        createdAt: r.createdAt,
        status: r.status,
        priority: r.status === 'Pending' ? 'Medium' : 'Low',
        details: {
          title: 'Remote Work Request',
          description: `For date: ${r.date}`,
          meta: { purpose: r.purpose, location: r.location }
        }
      })
    })

    // Map Performance Reviews
    performanceReviews.forEach(p => {
      if (p.status === 'Pending Manager Review') {
        items.push({
          id: `agg-p-${p.id}`,
          originalId: p.id,
          type: 'Performance',
          employeeId: p.employeeId,
          createdAt: p.selfAssessment?.submittedAt || new Date().toISOString(),
          status: 'Pending',
          priority: 'Medium',
          details: {
            title: `Performance Review - ${p.cycle}`,
            description: `Self-assessment submitted: Rating ${p.selfAssessment?.rating}/5`,
            meta: { comments: p.selfAssessment?.comments }
          }
        })
      }
    })

    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [leaveRequests, remoteRequests, performanceReviews])

  // Filter
  const filteredItems = approvalItems.filter(item => {
    if (filterType !== 'All' && item.type !== filterType) return false
    if (filterStatus !== 'All' && filterStatus === 'Pending' && !['Pending', 'Modification Requested'].includes(item.status)) return false
    if (filterStatus !== 'All' && filterStatus === 'Completed' && ['Pending', 'Modification Requested'].includes(item.status)) return false
    return true
  })

  // Quick Action Handlers
  const handleApprove = (item: ApprovalItem) => {
    if (item.type === 'Leave') updateLeaveStatus(item.originalId, 'Approved')
    if (item.type === 'Remote Attendance') updateRequestStatus(item.originalId, 'Approved')
    if (item.type === 'Performance') submitManagerReview(item.originalId, 4, "Auto-approved.")
    setSelectedItem(null)
  }

  const handleReject = (item: ApprovalItem) => {
    if (item.type === 'Leave') updateLeaveStatus(item.originalId, 'Rejected')
    if (item.type === 'Remote Attendance') updateRequestStatus(item.originalId, 'Rejected')
    setSelectedItem(null)
  }

  const getPriorityColor = (p: string) => {
    if (p === 'High') return 'text-ds-danger-dark bg-ds-danger-light/30 border-ds-danger-border'
    if (p === 'Medium') return 'text-amber-700 bg-amber-50 border-amber-200'
    return 'text-ds-neutral-600 bg-ds-neutral-100 border-ds-neutral-200'
  }

  return (
    <div className="flex flex-col h-full space-y-6 max-w-7xl mx-auto w-full p-6 overflow-y-auto">
      <PageHeader 
        title="Unified Approvals" 
      />

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 border border-ds-neutral-200 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <Filter className="size-5 text-ds-neutral-400" />
          <div className="flex gap-2">
            {['All', 'Leave', 'Remote Attendance', 'Performance'].map(t => (
              <Button 
                key={t} 
                variant={filterType === t ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilterType(t as ApprovalType | 'All')}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-ds-body-sm text-ds-neutral-500 font-medium mr-2">Status:</span>
           <select 
             className="text-ds-body-sm border border-ds-neutral-300 rounded-md px-3 py-1.5 bg-white outline-none focus:ring-2 focus:ring-ds-brand-green/20"
             value={filterStatus}
             onChange={e => setFilterStatus(e.target.value)}
           >
             <option value="Pending">Pending Action</option>
             <option value="Completed">Completed History</option>
             <option value="All">Show All</option>
           </select>
        </div>
      </div>

      <SectionCard title="Approval Queue" className="flex-1 min-h-[500px]">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle className="size-16 text-ds-success-light mb-4" />
            <h3 className="text-ds-heading text-ds-brand-navy">You're all caught up!</h3>
            <p className="text-ds-body text-ds-neutral-500">There are no pending requests matching your filters.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredItems.map(item => {
              const emp = employees.find(e => e.id === item.employeeId)
              return (
                <div 
                  key={item.id} 
                  className={`flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-xl hover:shadow-md transition-shadow cursor-pointer ${
                    item.priority === 'High' && item.status === 'Pending' ? 'border-l-4 border-l-ds-danger bg-red-50/10' : 'border-ds-neutral-200 bg-white'
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex items-start gap-4">
                    <div className="size-10 rounded-full bg-ds-brand-navy-light text-white flex items-center justify-center font-bold shrink-0 mt-1">
                      {emp?.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-ds-body font-semibold text-ds-brand-navy">{emp?.name}</span>
                        <span className="text-ds-caption text-ds-neutral-400">•</span>
                        <span className="text-ds-caption text-ds-neutral-500">{item.type}</span>
                        {item.status === 'Pending' && (
                          <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${getPriorityColor(item.priority)}`}>
                            {item.priority} Priority
                          </span>
                        )}
                      </div>
                      <span className="text-ds-body-sm text-ds-neutral-700">{item.details.title}</span>
                      <span className="text-ds-caption text-ds-neutral-500 mt-1 flex items-center gap-1">
                        <Clock className="size-3" /> Submitted {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 md:mt-0 justify-end">
                    <StatusBadge status={item.status === 'Completed' || item.status === 'Approved' ? 'Approved' : item.status === 'Rejected' ? 'Rejected' : 'Pending'} />
                    
                    {item.status === 'Pending' && (
                      <div className="flex items-center gap-2 ml-4 border-l border-ds-neutral-200 pl-4" onClick={(e) => e.stopPropagation()}>
                        <Button variant="outline" size="sm" className="text-ds-danger hover:bg-ds-danger hover:text-white" onClick={() => handleReject(item)}>
                          Reject
                        </Button>
                        <Button variant="default" size="sm" onClick={() => handleApprove(item)}>
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </SectionCard>

      {selectedItem && (
        <ApprovalDrawer 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  )
}
