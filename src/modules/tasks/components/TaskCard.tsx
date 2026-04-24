import * as React from 'react'
import { SeverityBadge, Avatar } from '@hryantra/ui'
import { Task, TaskPriority } from '../types'

export const FORMAT_DATE = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const initials = task.assignee.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2)
  return (
    <div 
      onClick={onClick}
      className="p-3 bg-white border border-ds-neutral-200 rounded shadow-sm cursor-pointer hover:border-ds-neutral-300 hover:shadow-md transition-all flex flex-col gap-2"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-ds-body-sm font-semibold text-ds-brand-navy leading-tight line-clamp-2">
          {task.title}
        </h4>
        <SeverityBadge level={capitalize(task.priority)} uppercase={false} className="shrink-0" />
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <span className="text-ds-caption text-ds-neutral-500 font-medium">{FORMAT_DATE(task.dueDate)}</span>
        <Avatar initials={initials} size="sm" gradient="navy" aria-label={task.assignee.name} />
      </div>
    </div>
  )
}
