import { AttendanceRecord, RemoteRequest } from '../types'

function generatePastRecords() {
  const records: AttendanceRecord[] = []
  let currentDate = new Date()
  
  for (let i = 1; i <= 14; i++) {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - i)
    if (d.getDay() === 0 || d.getDay() === 6) continue // skip weekends

    const dateStr = d.toISOString().split('T')[0]
    const isLate = i % 4 === 0
    const checkInTime = new Date(d)
    checkInTime.setHours(isLate ? 9 : 8, isLate ? 30 : 45, 0, 0)
    
    const checkOutTime = new Date(d)
    checkOutTime.setHours(17, 15, 0, 0)

    records.push({
      id: `ATT-MOCK-${i}`,
      employeeId: 'EMP-001',
      date: dateStr,
      checkIn: checkInTime.toISOString(),
      checkOut: checkOutTime.toISOString(),
      mode: i % 5 === 0 ? 'remote' : 'office',
      status: isLate ? 'Late' : 'Present',
      flags: isLate ? ['late'] : []
    })
  }
  return records
}

export const mockAttendanceRecords: AttendanceRecord[] = generatePastRecords()

export const mockRemoteRequests: RemoteRequest[] = [
  {
    id: 'REQ-001',
    employeeId: 'EMP-002',
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
    purpose: 'Client Site Visit',
    location: 'Acme Corp HQ',
    status: 'Pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'REQ-002',
    employeeId: 'EMP-001',
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
    purpose: 'Working from home due to repairs',
    location: 'Home',
    status: 'Approved',
    createdAt: new Date().toISOString()
  }
]
