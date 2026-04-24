"use client"

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PageHeader, Button } from '@hryantra/ui'
import { ArrowLeft } from 'lucide-react'
import { mockEmployees } from '../data/employees.mock'
import { EmployeeProfileHeader } from '../components/EmployeeProfileHeader'
import { EmployeeOverviewTab } from '../components/EmployeeOverviewTab'
import { EmployeeTasksTab } from '../components/EmployeeTasksTab'
import { EmployeeAttendanceTab } from '../components/EmployeeAttendanceTab'
import { EmployeeDocumentsTab } from '../components/EmployeeDocumentsTab'
import { EmployeePerformanceTab } from '../components/EmployeePerformanceTab'
import { EmployeeAssetsTab } from '../components/EmployeeAssetsTab'
import { TaskFormDrawer } from '../../tasks/components/TaskFormDrawer'
import { useStore } from '@/store/StoreProvider'

type TabType = 'overview' | 'tasks' | 'attendance' | 'assets' | 'documents' | 'performance'

export function EmployeeProfilePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { employees } = useStore()
  
  const [activeTab, setActiveTab] = React.useState<TabType>('overview')
  const [isTaskFormOpen, setIsTaskFormOpen] = React.useState(false)

  const employee = employees.find(emp => emp.id === id)

  if (!employee) {
    return (
      <div className="flex flex-col h-full space-y-6 max-w-7xl mx-auto w-full p-6">
        <PageHeader title="Employee Not Found" />
        <Button variant="outline" onClick={() => router.push('/employees')}>Back to Employees</Button>
      </div>
    )
  }

  const tabs: { key: TabType; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'tasks', label: 'Tasks' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'assets', label: 'Assets' },
    { key: 'documents', label: 'Documents' },
    { key: 'performance', label: 'Performance' },
  ]

  return (
    <div className="flex flex-col h-full space-y-6 max-w-7xl mx-auto w-full p-6">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="icon" onClick={() => router.push('/employees')}>
          <ArrowLeft className="size-4" />
        </Button>
        <span className="text-ds-body text-muted-foreground cursor-pointer hover:underline" onClick={() => router.push('/employees')}>
          Back to Directory
        </span>
      </div>

      <PageHeader
        title={employee.name}
      />

      <EmployeeProfileHeader employee={employee} onAssignTask={() => setIsTaskFormOpen(true)} />

      {/* Basic Tab Navigation */}
      <div className="flex items-center gap-6 border-b border-ds-neutral-200">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-ds-body font-medium transition-colors border-b-[3px] -mb-[1px] ${
                isActive 
                  ? 'border-ds-brand-green text-ds-brand-green' 
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-ds-neutral-300'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview'    && <EmployeeOverviewTab employee={employee} />}
        {activeTab === 'tasks'       && <EmployeeTasksTab employeeId={employee.id} />}
        {activeTab === 'attendance'  && <EmployeeAttendanceTab employeeId={employee.id} />}
        {activeTab === 'assets'      && <EmployeeAssetsTab />}
        {activeTab === 'documents'   && <EmployeeDocumentsTab employeeId={employee.id} />}
        {activeTab === 'performance' && <EmployeePerformanceTab />}
      </div>

      <TaskFormDrawer 
        open={isTaskFormOpen} 
        onClose={() => setIsTaskFormOpen(false)} 
        defaultAssigneeId={employee.id} 
      />
    </div>
  )
}
