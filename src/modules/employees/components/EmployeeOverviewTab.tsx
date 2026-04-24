import * as React from 'react'
import { SectionCard, StatusBadge } from '@hryantra/ui'
import { Employee } from '../types'

interface EmployeeOverviewTabProps {
  employee: Employee
}

export function EmployeeOverviewTab({ employee }: EmployeeOverviewTabProps) {
  return (
    <SectionCard title="Employee Details">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
        <div className="flex flex-col gap-1">
          <span className="text-ds-label text-muted-foreground uppercase">Employee ID</span>
          <span className="text-ds-body font-medium">{employee.id}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-ds-label text-muted-foreground uppercase">Email Address</span>
          <span className="text-ds-body font-medium">{employee.email}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-ds-label text-muted-foreground uppercase">Department</span>
          <span className="text-ds-body font-medium">{employee.department}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-ds-label text-muted-foreground uppercase">Manager</span>
          <span className="text-ds-body font-medium">{employee.manager}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-ds-label text-muted-foreground uppercase">Status</span>
          <div>
            <StatusBadge status={employee.status} />
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
