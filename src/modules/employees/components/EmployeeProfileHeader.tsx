import * as React from 'react'
import { SectionCard, Avatar, StatusBadge, Button } from '@hryantra/ui'
import { Employee } from '../types'

interface EmployeeProfileHeaderProps {
  employee: Employee
  onAssignTask?: () => void
}

export function EmployeeProfileHeader({ employee, onAssignTask }: EmployeeProfileHeaderProps) {
  const initials = employee.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2)
  
  return (
    <SectionCard>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar initials={initials} size="xl" gradient="emerald" />
          <div className="flex flex-col">
            <h2 className="text-ds-display flex items-center gap-3">
              {employee.name}
              <StatusBadge status={employee.status} withDot />
            </h2>
            <div className="text-ds-body text-muted-foreground mt-1 flex items-center gap-2">
              <span>{employee.designation}</span>
              <span>&middot;</span>
              <span>{employee.department}</span>
            </div>
            <div className="text-ds-body-sm text-muted-foreground mt-1">
              Reports to: <span className="font-medium text-foreground">{employee.manager}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-row gap-3 self-start sm:self-center">
          <Button variant="outline">Edit</Button>
          <Button variant="default" onClick={onAssignTask}>Assign Task</Button>
        </div>
      </div>
    </SectionCard>
  )
}
