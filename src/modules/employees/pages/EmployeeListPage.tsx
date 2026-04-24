"use client"

import * as React from 'react'
import {
  PageHeader,
  SectionCard,
  DataTable,
  Button,
  Avatar,
  StatusBadge,
  type ColumnDef,
  type SortDirection
} from '@hryantra/ui'
import { MoreHorizontal } from 'lucide-react'
import { Employee } from '../types'
import { mockEmployees } from '../data/employees.mock'

import { useRouter } from 'next/navigation'

import { useStore } from '@/store/StoreProvider'

export function EmployeeListPage() {
  const router = useRouter()
  const { employees } = useStore()
  const [data, setData] = React.useState<Employee[]>(employees)
  const [sortColumn, setSortColumn] = React.useState<string | undefined>()
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null)
  const [page, setPage] = React.useState(1)

  // React to store changes
  React.useEffect(() => {
    setData(employees)
  }, [employees])

  const handleSort = (columnId: string, direction: SortDirection) => {
    setSortColumn(columnId)
    setSortDirection(direction)

    if (!direction) {
      setData(employees)
      return
    }

    const sorted = [...employees].sort((a, b) => {
      const aVal = a[columnId as keyof Employee]
      const bVal = b[columnId as keyof Employee]
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return 0
    })
    setData(sorted)
  }

  const columns: ColumnDef<Employee>[] = [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Employee',
      sortable: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-3 py-1">
          <Avatar 
            initials={row.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2)} 
            size="md" 
            gradient="emerald" 
          />
          <div className="flex flex-col overflow-hidden">
            <span className="text-ds-body-sm font-semibold truncate text-foreground">{row.name}</span>
            <span className="text-ds-caption text-muted-foreground truncate">{row.designation}</span>
          </div>
        </div>
      )
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: 'Email',
      className: 'text-ds-body-sm text-muted-foreground',
    },
    {
      id: 'department',
      accessorKey: 'department',
      header: 'Department',
      sortable: true,
      className: 'text-ds-body-sm',
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.status} withDot />
    },
    {
      id: 'manager',
      accessorKey: 'manager',
      header: 'Manager',
      className: 'text-ds-body-sm',
    },
    {
      id: 'actions',
      header: '',
      width: 60,
      cell: ({ row }) => (
        <div className="flex justify-end pr-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e: React.MouseEvent) => { 
              e.stopPropagation()
              router.push(`/employees/${row.id}`)
            }}
          >
            <MoreHorizontal className="size-4 text-muted-foreground" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="flex flex-col h-full space-y-6 max-w-7xl mx-auto w-full">
      <PageHeader
        title="Employees"
        actions={<Button variant="default">Add Employee</Button>}
      />

      <SectionCard>
        <DataTable
          data={data}
          columns={columns}
          keyExtractor={(row) => row.id}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRowClick={(row) => router.push(`/employees/${row.id}`)}
          pagination={{
            page: page,
            perPage: 10,
            total: employees.length,
            onPageChange: setPage,
            perPageOptions: [10, 20, 50]
          }}
        />
      </SectionCard>
    </div>
  )
}
