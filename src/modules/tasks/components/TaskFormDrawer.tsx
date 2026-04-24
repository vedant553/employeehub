import * as React from 'react'
import { DrawerWrapper, Button } from '@hryantra/ui'
import { TaskForm } from './TaskForm'
import { useStore } from '@/store/StoreProvider'

interface TaskFormDrawerProps {
  open: boolean
  onClose: () => void
  defaultAssigneeId?: string
}

export function TaskFormDrawer({ open, onClose, defaultAssigneeId }: TaskFormDrawerProps) {
  const { addTask } = useStore()

  const handleSave = () => {
    // In a real app we'd collect form data. Here we mock it.
    addTask({
      title: 'New Assigned Task',
      description: 'Task assigned from profile or system',
      status: 'todo',
      priority: 'medium',
      assignee: { id: defaultAssigneeId || 'EMP-001', name: 'Selected Assignee' },
      assignedBy: 'EMP-000',
      dueDate: new Date().toISOString()
    })
    onClose()
  }

  return (
    <DrawerWrapper
      open={open}
      onClose={onClose}
      title="Create New Task"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} className="mr-auto">Cancel</Button>
          <Button variant="default" onClick={handleSave}>Create Task</Button>
        </>
      }
    >
      <TaskForm />
    </DrawerWrapper>
  )
}
