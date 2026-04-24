import * as React from 'react'
import { AttendanceCalendar } from '../../attendance/components/AttendanceCalendar'
import { AttendanceLogsTable } from '../../attendance/components/AttendanceLogsTable'
import { useStore } from '@/store/StoreProvider'

interface EmployeeAttendanceTabProps {
  employeeId: string
}

export function EmployeeAttendanceTab({ employeeId }: EmployeeAttendanceTabProps) {
  const { attendanceRecords } = useStore()
  
  const userLogs = React.useMemo(() => {
    return attendanceRecords.filter(r => r.employeeId === employeeId)
  }, [attendanceRecords, employeeId])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AttendanceCalendar records={userLogs} />
      
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-lg border border-ds-neutral-200 overflow-hidden shadow-sm flex flex-col h-[400px]">
           <div className="px-6 py-4 border-b border-ds-neutral-200 bg-white sticky top-0 z-10 shrink-0">
             <h3 className="text-ds-body font-bold text-ds-brand-navy">Attendance Logs</h3>
           </div>
           <div className="flex-1 overflow-auto bg-ds-surface-page p-2">
              <AttendanceLogsTable records={userLogs} />
           </div>
        </div>
      </div>
    </div>
  )
}
