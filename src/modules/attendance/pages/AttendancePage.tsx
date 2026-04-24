"use client"
import * as React from 'react'
import { PageHeader, Button } from '@hryantra/ui'
import { AttendanceDashboard } from '../components/AttendanceDashboard'
import { AttendanceCalendar } from '../components/AttendanceCalendar'
import { AttendanceLogsTable } from '../components/AttendanceLogsTable'
import { ApprovalPanel } from '../components/ApprovalPanel'
import { RemoteRequestForm } from '../components/RemoteRequestForm'
import { useStore, CURRENT_USER_ID } from '@/store/StoreProvider'

export function AttendancePage() {
  const { attendanceRecords } = useStore()
  const [isRequestOpen, setIsRequestOpen] = React.useState(false)

  // Filter logs for the current user
  const userLogs = React.useMemo(() => {
    return attendanceRecords.filter(r => r.employeeId === CURRENT_USER_ID)
  }, [attendanceRecords])

  return (
    <div className="flex flex-col h-[calc(100vh-32px)] max-h-screen space-y-6 max-w-7xl mx-auto w-full p-6 overflow-y-auto">
      <PageHeader 
        title="Attendance & Time Tracking" 
        actions={
          <Button variant="default" onClick={() => setIsRequestOpen(true)}>
            Request Remote Work
          </Button>
        }
      />

      <AttendanceDashboard />

      <ApprovalPanel />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceCalendar records={userLogs} />
        
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-lg border border-ds-neutral-200 overflow-hidden shadow-sm flex flex-col h-[400px]">
             <div className="px-6 py-4 border-b border-ds-neutral-200 bg-white sticky top-0 z-10 shrink-0">
               <h3 className="text-ds-body font-bold text-ds-brand-navy">Recent Attendance Logs</h3>
             </div>
             <div className="flex-1 overflow-auto bg-ds-surface-page p-2">
                <AttendanceLogsTable records={userLogs} />
             </div>
          </div>
        </div>
      </div>

      <RemoteRequestForm open={isRequestOpen} onClose={() => setIsRequestOpen(false)} />
    </div>
  )
}
