"use client"
import * as React from 'react'
import { SectionCard, Button, StatusBadge } from '@hryantra/ui'
import { useStore, CURRENT_USER_ID } from '@/store/StoreProvider'
import { LogIn, LogOut, Navigation2 } from 'lucide-react'

export function AttendanceDashboard() {
  const { attendanceRecords, checkIn, checkOut } = useStore()
  
  const todayDate = new Date().toISOString().split('T')[0]
  const todayRecord = attendanceRecords.find(r => r.date === todayDate && r.employeeId === CURRENT_USER_ID)
  
  const hasCheckedIn = !!todayRecord
  const hasCheckedOut = !!todayRecord?.checkOut
  
  const formatTime = (isoString?: string | null) => {
    if (!isoString) return '--:--'
    return new Date(isoString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <SectionCard title="Today's Attendance">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Status display */}
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <span className="text-ds-label text-ds-neutral-500 uppercase mb-1">Status</span>
            <div className="flex items-center">
              <StatusBadge status={todayRecord?.status || 'Absent'} />
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-ds-label text-ds-neutral-500 uppercase mb-1">Check In</span>
            <span className="text-ds-heading font-medium text-ds-brand-navy">{formatTime(todayRecord?.checkIn)}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-ds-label text-ds-neutral-500 uppercase mb-1">Check Out</span>
            <span className="text-ds-heading font-medium text-ds-brand-navy">{formatTime(todayRecord?.checkOut)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {!hasCheckedIn ? (
            <>
              <Button variant="primary" onClick={() => checkIn('office')}>
                <LogIn className="size-4 mr-2" />
                Office Check-in
              </Button>
              <Button variant="outline" onClick={() => checkIn('remote', 'Home')}>
                <Navigation2 className="size-4 mr-2" />
                Remote Check-in
              </Button>
            </>
          ) : !hasCheckedOut ? (
            <Button variant="outline" onClick={() => checkOut()} className="border-red-200 text-red-600 hover:bg-red-50">
              <LogOut className="size-4 mr-2" />
              Check Out
            </Button>
          ) : (
            <span className="text-ds-body-sm font-medium text-ds-success pr-4">Session recorded</span>
          )}
        </div>
        
      </div>
    </SectionCard>
  )
}
