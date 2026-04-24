"use client"
import * as React from 'react'
import { DataTable, StatusBadge, type ColumnDef } from '@hryantra/ui'
import { AttendanceRecord } from '../types'

interface AttendanceLogsTableProps {
  records: AttendanceRecord[]
}

export function AttendanceLogsTable({ records }: AttendanceLogsTableProps) {
  const [page, setPage] = React.useState(1)

  const columns: ColumnDef<AttendanceRecord>[] = [
    {
      id: 'date',
      accessorKey: 'date',
      header: 'Date',
      sortable: true,
      cell: ({ row }) => <span className="text-ds-body font-medium">{new Date(row.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
    },
    {
      id: 'checkIn',
      accessorKey: 'checkIn',
      header: 'Check In',
      cell: ({ row }) => <span className="text-ds-body-sm text-ds-neutral-600">{row.checkIn ? new Date(row.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--'}</span>
    },
    {
      id: 'checkOut',
      accessorKey: 'checkOut',
      header: 'Check Out',
      cell: ({ row }) => <span className="text-ds-body-sm text-ds-neutral-600">{row.checkOut ? new Date(row.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--'}</span>
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.status} />
    },
    {
      id: 'mode',
      accessorKey: 'mode',
      header: 'Mode',
      cell: ({ row }) => <span className="text-ds-body-sm capitalize text-ds-neutral-500">{row.mode}</span>
    }
  ]

  // Default sorting to newest first
  const sortedRecords = React.useMemo(() => {
    return [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [records])

  return (
    <DataTable
      data={sortedRecords}
      columns={columns}
      keyExtractor={(r) => r.id}
      emptyTitle="No attendance records"
      pagination={{
        page,
        perPage: 10,
        total: records.length,
        onPageChange: setPage
      }}
    />
  )
}
