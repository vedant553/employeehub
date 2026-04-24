import * as React from 'react'
import { DataTable, Avatar, StatusBadge, SeverityBadge, Button, type ColumnDef, type SortDirection } from '@hryantra/ui'
import { MoreHorizontal } from 'lucide-react'
import { Task } from '../types'
import { FORMAT_DATE, capitalize } from './TaskCard'

interface TaskListTableProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

const mapStatusToLabel = (s: string) => {
  if (s === 'todo') return 'Draft'
  if (s === 'in_progress') return 'In Progress'
  if (s === 'blocked') return 'Action Required'
  if (s === 'completed') return 'Resolved'
  return s
}

export function TaskListTable({ tasks, onTaskClick }: TaskListTableProps) {
  const [sortColumn, setSortColumn] = React.useState<string | undefined>()
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null)
  const [page, setPage] = React.useState(1)

  const sortedTasks = React.useMemo(() => {
    if (!sortDirection || !sortColumn) return tasks
    return [...tasks].sort((a, b) => {
      const aVal = String(a[sortColumn as keyof Task] || '')
      const bVal = String(b[sortColumn as keyof Task] || '')
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })
  }, [tasks, sortColumn, sortDirection])

  const columns: ColumnDef<Task>[] = [
    {
      id: 'title',
      accessorKey: 'title',
      header: 'Task',
      sortable: true,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-ds-body-sm font-semibold truncate text-ds-brand-navy">{row.title}</span>
          {row.description && <span className="text-ds-caption text-ds-neutral-500 truncate max-w-[200px]">{row.description}</span>}
        </div>
      )
    },
    {
      id: 'assignee',
      accessorKey: 'assignee',
      header: 'Assignee',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar 
             initials={row.assignee.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2)} 
             size="sm" 
             gradient="emerald" 
             aria-label={row.assignee.name}
          />
          <span className="text-ds-body-sm">{row.assignee.name}</span>
        </div>
      )
    },
    {
      id: 'priority',
      accessorKey: 'priority',
      header: 'Priority',
      sortable: true,
      cell: ({ row }) => <SeverityBadge level={capitalize(row.priority)} uppercase={false} />
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={mapStatusToLabel(row.status)} />
    },
    {
      id: 'dueDate',
      accessorKey: 'dueDate',
      header: 'Due Date',
      sortable: true,
      cell: ({ row }) => <span className="text-ds-body-sm font-medium text-ds-neutral-600">{FORMAT_DATE(row.dueDate)}</span>
    },
    {
      id: 'actions',
      header: '',
      width: 60,
      cell: ({ row }) => (
        <div className="flex justify-end pr-2">
          <Button variant="ghost" size="icon" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onTaskClick(row) }}>
            <MoreHorizontal className="size-4 text-ds-neutral-500" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <DataTable
      data={sortedTasks}
      columns={columns}
      keyExtractor={(t) => t.id}
      emptyTitle="No tasks found"
      emptyDescription="Create a new task to get started."
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={(col, dir) => { setSortColumn(col); setSortDirection(dir) }}
      onRowClick={(row) => onTaskClick(row)}
      pagination={{
        page,
        perPage: 10,
        total: tasks.length,
        onPageChange: setPage
      }}
    />
  )
}
