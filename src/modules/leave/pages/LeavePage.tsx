"use client"

import * as React from 'react'
import { PageHeader, Button, SectionCard } from '@hryantra/ui'
import { LeaveApplicationDrawer } from '../components/LeaveApplicationDrawer'
import { LeaveApprovalsPanel } from '../components/LeaveApprovalsPanel'
import { LeaveHistoryTable } from '../components/LeaveHistoryTable'
import { useStore, CURRENT_USER_ID } from '@/store/StoreProvider'
import { Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

export function LeavePage() {
  const { leaveRequests } = useStore()
  const [isApplyOpen, setIsApplyOpen] = React.useState(false)

  const myLeaves = React.useMemo(() => {
    return leaveRequests.filter(r => r.employeeId === CURRENT_USER_ID)
  }, [leaveRequests])

  const approvedLeaves = myLeaves.filter(r => r.status === 'Approved').reduce((acc, curr) => acc + curr.totalDays, 0)
  const pendingLeaves = myLeaves.filter(r => r.status === 'Pending').length

  // Quick stat logic (assuming 20 days standard balance)
  const availableBalance = 20 - approvedLeaves

  return (
    <div className="flex flex-col h-[calc(100vh-32px)] max-h-screen space-y-6 max-w-7xl mx-auto w-full p-6 overflow-y-auto">
      <PageHeader
        title="Leave Management"
        actions={
          <Button variant="primary" onClick={() => setIsApplyOpen(true)}>
            Apply for Leave
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SectionCard className="flex flex-col">
          <div className="flex items-center gap-3 text-ds-neutral-500 mb-2">
            <Calendar className="size-5" />
            <span className="text-ds-label uppercase font-semibold">Leave Balance</span>
          </div>
          <span className="text-3xl font-bold text-ds-brand-navy">{availableBalance} <span className="text-ds-body text-ds-neutral-500 font-medium">days out of 20</span></span>
        </SectionCard>

        <SectionCard className="flex flex-col">
          <div className="flex items-center gap-3 text-ds-success mb-2">
            <CheckCircle2 className="size-5" />
            <span className="text-ds-label uppercase font-semibold">Approved Takes</span>
          </div>
          <span className="text-3xl font-bold text-ds-brand-navy">{approvedLeaves} <span className="text-ds-body text-ds-neutral-500 font-medium">days</span></span>
        </SectionCard>

        <SectionCard className="flex flex-col border-amber-200 bg-amber-50/30">
          <div className="flex items-center gap-3 text-amber-600 mb-2">
            <Clock className="size-5" />
            <span className="text-ds-label uppercase font-semibold">Pending Approvals</span>
          </div>
          <span className="text-3xl font-bold text-amber-700">{pendingLeaves} <span className="text-ds-body text-amber-600 font-medium">requests</span></span>
        </SectionCard>
      </div>

      <LeaveApprovalsPanel />

      <SectionCard title="My Leave History" className="flex flex-col flex-1 min-h-[400px]">
        <div className="flex-1 overflow-auto min-h-0 -mx-6 px-6">
          <LeaveHistoryTable requests={myLeaves} />
        </div>
      </SectionCard>

      <LeaveApplicationDrawer open={isApplyOpen} onClose={() => setIsApplyOpen(false)} />
    </div>
  )
}
