import * as React from 'react'
import { DrawerWrapper, Button, StatusBadge, SeverityBadge, Avatar } from '@hryantra/ui'
import { Task } from '../types'
import { FORMAT_DATE, capitalize } from './TaskCard'

interface TaskDetailDrawerProps {
  task: Task | null
  open: boolean
  onClose: () => void
}

const mapStatusToLabel = (s: string) => {
  if (s === 'todo') return 'Draft'
  if (s === 'in_progress') return 'In Progress'
  if (s === 'blocked') return 'Action Required'
  if (s === 'completed') return 'Resolved'
  return s
}

export function TaskDetailDrawer({ task, open, onClose }: TaskDetailDrawerProps) {
  if (!task) return null

  const initials = task.assignee.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2)

  return (
    <DrawerWrapper
      open={open}
      onClose={onClose}
      title={task.title}
      subtitle={`Task ID: ${task.id} • Created ${FORMAT_DATE(task.createdAt)}`}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} className="mr-auto">Close</Button>
          <Button variant="outline">Update Status</Button>
          <Button variant="primary">Mark Complete</Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Status / Meta Header */}
        <div className="flex flex-wrap items-center gap-4 border-b border-ds-neutral-200 pb-4">
          <StatusBadge status={mapStatusToLabel(task.status)} />
          <SeverityBadge level={capitalize(task.priority)} />
          <span className="text-ds-body-sm text-ds-neutral-500 mr-auto">
            Due: <strong className="text-ds-brand-navy">{FORMAT_DATE(task.dueDate)}</strong>
          </span>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <h3 className="text-ds-heading-sm font-semibold text-ds-brand-navy">Description</h3>
          <p className="text-ds-body text-ds-neutral-600">
            {task.description || "No description provided."}
          </p>
        </div>

        {/* Attributes Grid */}
        <div className="grid grid-cols-2 gap-4 bg-ds-surface-page p-4 rounded-lg border border-ds-neutral-200">
          <div className="flex flex-col gap-1">
            <span className="text-ds-label text-ds-neutral-500">Assignee</span>
            <div className="flex items-center gap-2 mt-1">
              <Avatar initials={initials} size="xs" gradient="emerald" />
              <span className="text-ds-body font-medium">{task.assignee.name}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-ds-label text-ds-neutral-500">Assigned By</span>
            <span className="text-ds-body">{task.assignedBy}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-ds-label text-ds-neutral-500">Estimated Hours</span>
            <span className="text-ds-body">{task.estimatedHours || 0}h</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-ds-label text-ds-neutral-500">Time Logged</span>
            <span className="text-ds-body">{task.timeLogged || 0}h</span>
          </div>
        </div>

        {/* Comments Static */}
        <div className="flex flex-col gap-3 mt-4">
          <h3 className="text-ds-heading-sm font-semibold border-b border-ds-neutral-200 pb-2 text-ds-brand-navy">Comments</h3>
          <div className="text-ds-body-sm text-ds-neutral-400 italic">No comments yet.</div>
        </div>
      </div>
    </DrawerWrapper>
  )
}
