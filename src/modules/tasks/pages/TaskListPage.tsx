"use client"

import * as React from 'react'
import { PageHeader, Button, SectionCard } from '@hryantra/ui'
import { LayoutList, KanbanSquare, Plus } from 'lucide-react'
import { mockTasks } from '../data/tasks.mock'
import { TaskListTable } from '../components/TaskListTable'
import { TaskBoard } from '../components/TaskBoard'
import { TaskDetailDrawer } from '../components/TaskDetailDrawer'
import { TaskFilters } from '../components/TaskFilters'
import { useStore } from '@/store/StoreProvider'
import { Task } from '../types'

export function TaskListPage() {
  const { tasks, currentUserRole } = useStore()
  const [viewMode, setViewMode] = React.useState<'list' | 'board'>('list')
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null)

  const filteredTasks = React.useMemo(() => {
    if (currentUserRole === 'HR') return tasks
    if (currentUserRole === 'Manager') {
      // Simulation: Managers see all tasks for now, but in reality would be team filter
      return tasks 
    }
    // Employees only see tasks assigned to them
    return tasks.filter(t => t.assignee.id === 'EMP-001')
  }, [tasks, currentUserRole])

  return (
    <div className="flex flex-col h-[calc(100vh-32px)] max-h-screen space-y-6 max-w-7xl mx-auto w-full p-6">
      <PageHeader
        title="Tasks"
        actions={
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-ds-neutral-100 p-1 rounded-lg border border-ds-neutral-200">
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                size="sm"
                className={viewMode === 'list' ? 'bg-white text-ds-brand-navy shadow-sm hover:bg-white' : ''}
                onClick={() => setViewMode('list')}
              >
                <LayoutList className="size-4 mr-2" />
                List
              </Button>
              <Button 
                variant={viewMode === 'board' ? 'default' : 'ghost'} 
                size="sm"
                className={viewMode === 'board' ? 'bg-white text-ds-brand-navy shadow-sm hover:bg-white' : ''}
                onClick={() => setViewMode('board')}
              >
                <KanbanSquare className="size-4 mr-2" />
                Board
              </Button>
            </div>
            {currentUserRole !== 'Employee' && (
              <Button variant="default">
                <Plus className="size-4 mr-2" />
                Create Task
              </Button>
            )}
          </div>
        }
      />

      <SectionCard className="flex flex-col gap-4 flex-1 min-h-0 overflow-hidden">
        {/* Filters Top Bar */}
        <TaskFilters />

        {/* Dynamic View Content */}
        <div className="flex-1 overflow-auto min-h-0 -mx-6 px-6">
          {viewMode === 'list' ? (
            <TaskListTable tasks={filteredTasks} onTaskClick={setSelectedTask} />
          ) : (
            <TaskBoard tasks={filteredTasks} onTaskClick={setSelectedTask} />
          )}
        </div>
      </SectionCard>

      {/* Detail Drawer */}
      <TaskDetailDrawer 
        open={selectedTask !== null} 
        onClose={() => setSelectedTask(null)} 
        task={selectedTask} 
      />
    </div>
  )
}
