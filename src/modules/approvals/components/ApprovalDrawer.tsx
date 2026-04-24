import * as React from 'react'
import { ApprovalItem } from '../types'
import { Button, StatusBadge } from '@hryantra/ui'
import { useStore } from '@/store/StoreProvider'
import { X, CalendarDays, User, Clock, FileText, AlertCircle } from 'lucide-react'

export function ApprovalDrawer({ item, onClose, onApprove, onReject }: { 
  item: ApprovalItem
  onClose: () => void 
  onApprove: (item: ApprovalItem) => void
  onReject: (item: ApprovalItem) => void
}) {
  const { employees, updateLeaveStatus } = useStore()
  const emp = employees.find(e => e.id === item.employeeId)
  
  const [remarks, setRemarks] = React.useState('')

  const handleCustomAction = (action: 'approve' | 'reject' | 'modify') => {
    if (action === 'approve') onApprove(item)
    if (action === 'reject') onReject(item)
    if (action === 'modify' && item.type === 'Leave') {
      updateLeaveStatus(item.originalId, 'Modification Requested', remarks)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ds-brand-navy/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-ds-neutral-200">
          <div className="flex flex-col">
            <h3 className="text-ds-heading-sm font-bold text-ds-brand-navy">Review Request</h3>
            <span className="text-ds-caption text-ds-neutral-500">{item.id}</span>
          </div>
          <button onClick={onClose} className="p-2 text-ds-neutral-400 hover:text-ds-brand-navy hover:bg-ds-neutral-100 rounded-full transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          
          <div className="flex items-center gap-4 bg-ds-neutral-50 p-4 rounded-xl border border-ds-neutral-200">
            <div className="size-12 rounded-full bg-ds-brand-navy text-white flex items-center justify-center font-bold text-lg shrink-0">
              {emp?.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex flex-col">
              <span className="text-ds-body font-bold text-ds-brand-navy">{emp?.name}</span>
              <span className="text-ds-body-sm text-ds-neutral-500">{emp?.designation} • {emp?.department}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-ds-label-upper text-ds-neutral-400 border-b pb-2">Request Details</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-ds-caption text-ds-neutral-500 flex items-center gap-1"><FileText className="size-3"/> Type</span>
                <span className="text-ds-body-sm font-medium">{item.type}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-ds-caption text-ds-neutral-500 flex items-center gap-1"><Clock className="size-3"/> Submitted On</span>
                <span className="text-ds-body-sm font-medium">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="bg-ds-brand-navy-light/5 border border-ds-neutral-200 rounded-lg p-4 mt-2">
              <h5 className="text-ds-body font-semibold text-ds-brand-navy mb-1">{item.details.title}</h5>
              <p className="text-ds-body-sm text-ds-neutral-600 mb-3">{item.details.description}</p>
              
              {item.details.meta && Object.entries(item.details.meta).map(([key, val]) => (
                <div key={key} className="flex flex-col mt-2 pt-2 border-t border-ds-neutral-200/50">
                  <span className="text-ds-caption uppercase text-ds-neutral-500 mb-0.5">{key}</span>
                  <span className="text-ds-body-sm italic">"{val}"</span>
                </div>
              ))}
            </div>
          </div>

          {item.status === 'Pending' && (
            <div className="flex flex-col gap-3 mt-4">
              <h4 className="text-ds-label-upper text-ds-neutral-400 border-b pb-2">Manager Action</h4>
              
              <textarea 
                className="w-full text-ds-body-sm border border-ds-neutral-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-ds-brand-green/20 min-h-[100px] resize-none"
                placeholder="Optional remarks or reasoning..."
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
              />
            </div>
          )}
        </div>

        {item.status === 'Pending' ? (
          <div className="p-6 border-t border-ds-neutral-200 bg-ds-neutral-50 flex flex-col gap-3">
             {item.type === 'Leave' && (
               <Button variant="outline" className="w-full border-amber-300 text-amber-700 hover:bg-amber-50" onClick={() => handleCustomAction('modify')}>
                 Request Modification
               </Button>
             )}
             <div className="flex gap-3">
               <Button variant="outline" className="flex-1 text-ds-danger border-ds-danger hover:bg-ds-danger hover:text-white" onClick={() => handleCustomAction('reject')}>
                 Reject
               </Button>
               <Button variant="default" className="flex-1" onClick={() => handleCustomAction('approve')}>
                 Approve Request
               </Button>
             </div>
          </div>
        ) : (
          <div className="p-6 border-t border-ds-neutral-200 bg-ds-neutral-50 flex items-center justify-between">
            <span className="text-ds-body-sm text-ds-neutral-500 font-medium">Current Status:</span>
            <StatusBadge status={item.status === 'Completed' || item.status === 'Approved' ? 'Approved' : item.status === 'Rejected' ? 'Rejected' : item.status} />
          </div>
        )}
      </div>
    </div>
  )
}
