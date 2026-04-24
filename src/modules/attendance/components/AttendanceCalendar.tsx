"use client"
import * as React from 'react'
import { SectionCard } from '@hryantra/ui'
import { AttendanceRecord } from '../types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Simple helper functions
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

interface AttendanceCalendarProps {
  records: AttendanceRecord[]
}

export function AttendanceCalendar({ records }: AttendanceCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month) // 0-indexed, 0 = Sunday

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  
  const getRecordForDate = (day: number) => {
    // format to local YYYY-MM-DD
    const dStr = new Date(year, month, day).toLocaleDateString('en-CA') // outputs YYYY-MM-DD locally most consistently
    // Fallback manual format for safety against timezone issues:
    const safeStr = `${year}-${String(month+1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return records.find(r => r.date === safeStr)
  }

  const getStatusColor = (status?: string, dateStr?: string) => {
    if (!status) {
      if (new Date(dateStr!) > new Date()) return 'bg-white' // Future
      return 'bg-ds-neutral-50 border-dashed text-ds-neutral-300' // Absent / No record
    }
    if (status === 'Present') return 'bg-ds-success-light border-ds-success/30 text-ds-success'
    if (status === 'Late') return 'bg-amber-100 border-amber-300 text-amber-700'
    if (status === 'Absent') return 'bg-ds-danger-light border-ds-danger/30 text-ds-danger'
    if (status === 'Half-day') return 'bg-orange-100 border-orange-300 text-orange-700'
    return 'bg-white'
  }

  return (
    <SectionCard title="Attendance Calendar">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-ds-body font-bold text-ds-brand-navy">{monthName}</h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-1 hover:bg-ds-neutral-100 rounded text-ds-neutral-500"><ChevronLeft className="size-5" /></button>
          <button onClick={nextMonth} className="p-1 hover:bg-ds-neutral-100 rounded text-ds-neutral-500"><ChevronRight className="size-5" /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-ds-caption font-bold text-ds-neutral-500 py-2 uppercase tracking-wide">
            {d}
          </div>
        ))}
        
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2 h-16 rounded-md bg-transparent" />
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const rec = getRecordForDate(day)
          const safeStr = `${year}-${String(month+1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const colorClass = getStatusColor(rec?.status, safeStr)
          
          return (
            <div key={day} className={`p-2 h-[80px] rounded-lg border flex flex-col justify-between ${colorClass}`}>
              <span className="text-sm font-semibold opacity-70">{day}</span>
              {rec && <span className="text-[10px] font-bold uppercase tracking-tight line-clamp-1">{rec.status}</span>}
              {!rec && new Date(safeStr) < new Date() && new Date(safeStr).getDay() !== 0 && new Date(safeStr).getDay() !== 6 && (
                <span className="text-[10px] font-bold uppercase tracking-tight text-ds-danger line-clamp-1 opacity-70">Absent</span>
              )}
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}
