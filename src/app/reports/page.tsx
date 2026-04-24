"use client"
import * as React from 'react'
import { PageHeader, SectionCard, DataTable, Button, Input, Select, StatusBadge, SeverityBadge, type ColumnDef } from '@hryantra/ui'
import { useStore } from '@/store/StoreProvider'
import { BarChart3, Clock, CheckSquare, Target, CalendarDays, Download, Filter, Search, TrendingUp, Users } from 'lucide-react'

type ReportType = 'attendance' | 'tasks' | 'performance' | 'leave'

export default function ReportsPage() {
  const { employees, tasks, attendanceRecords, leaveRequests, performanceReviews, currentUserRole } = useStore()
  const [activeTab, setActiveTab] = React.useState<ReportType>('attendance')

  if (currentUserRole !== 'HR') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-ds-neutral-50">
        <Target className="size-16 text-ds-neutral-200 mb-4" />
        <h3 className="text-ds-heading text-ds-brand-navy">Analytics Restricted</h3>
        <p className="text-ds-body text-ds-neutral-500 max-w-md">Reports and analytics are only available to HR and Administrative roles.</p>
      </div>
    )
  }
  
  // Filters
  const [dateRange, setDateRange] = React.useState({ start: '', end: '' })
  const [selectedEmployee, setSelectedEmployee] = React.useState('All')
  const [searchTerm, setSearchTerm] = React.useState('')

  const tabs = [
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'performance', label: 'Performance', icon: Target },
    { id: 'leave', label: 'Leave', icon: CalendarDays },
  ]

  // --- Attendance Logic ---
  const attendanceData = React.useMemo(() => {
    return attendanceRecords.filter(r => {
      const emp = employees.find(e => e.id === r.employeeId)
      const matchesSearch = emp?.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesEmp = selectedEmployee === 'All' || r.employeeId === selectedEmployee
      return matchesSearch && matchesEmp
    }).map(r => ({
      ...r,
      employeeName: employees.find(e => e.id === r.employeeId)?.name || 'Unknown'
    }))
  }, [attendanceRecords, employees, searchTerm, selectedEmployee])

  const attendanceKPIs = React.useMemo(() => {
    const total = attendanceData.length
    const late = attendanceData.filter(r => r.status === 'Late').length
    const remote = attendanceData.filter(r => r.mode === 'remote').length
    return [
      { label: 'Total Records', value: total, icon: Users, color: 'text-ds-brand-navy' },
      { label: 'Late Comers', value: late, icon: TrendingUp, color: 'text-ds-danger' },
      { label: 'Remote Work %', value: total ? Math.round((remote / total) * 100) + '%' : '0%', icon: BarChart3, color: 'text-ds-info-dark' },
    ]
  }, [attendanceData])

  // --- Tasks Logic ---
  const taskData = React.useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.assignee.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesEmp = selectedEmployee === 'All' || t.assignee.id === selectedEmployee
      return matchesSearch && matchesEmp
    })
  }, [tasks, searchTerm, selectedEmployee])

  const taskKPIs = React.useMemo(() => {
    const total = taskData.length
    const completed = taskData.filter(t => t.status === 'completed').length
    const overdue = taskData.filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date()).length
    return [
      { label: 'Total Tasks', value: total, icon: CheckSquare, color: 'text-ds-brand-navy' },
      { label: 'Completion Rate', value: total ? Math.round((completed / total) * 100) + '%' : '0%', icon: BarChart3, color: 'text-ds-success-text' },
      { label: 'Overdue Tasks', value: overdue, icon: TrendingUp, color: 'text-ds-danger' },
    ]
  }, [taskData])

  // --- Performance Logic ---
  const performanceData = React.useMemo(() => {
    return performanceReviews.filter(r => {
      const emp = employees.find(e => e.id === r.employeeId)
      const matchesSearch = emp?.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesEmp = selectedEmployee === 'All' || r.employeeId === selectedEmployee
      return matchesSearch && matchesEmp && r.status === 'Completed'
    }).map(r => ({
      ...r,
      employeeName: employees.find(e => e.id === r.employeeId)?.name || 'Unknown'
    }))
  }, [performanceReviews, employees, searchTerm, selectedEmployee])

  const performanceKPIs = React.useMemo(() => {
    const total = performanceData.length
    const avgScore = total ? Math.round(performanceData.reduce((acc, r) => acc + (r.metrics.finalScore || 0), 0) / total) : 0
    const topPerformers = performanceData.filter(r => (r.metrics.finalScore || 0) >= 90).length
    return [
      { label: 'Reviews Completed', value: total, icon: Target, color: 'text-ds-brand-navy' },
      { label: 'Average Score', value: avgScore, icon: BarChart3, color: 'text-ds-brand-green' },
      { label: 'Top Performers', value: topPerformers, icon: Users, color: 'text-ds-info-dark' },
    ]
  }, [performanceData])

  // --- Leave Logic ---
  const leaveData = React.useMemo(() => {
    return leaveRequests.filter(r => {
      const emp = employees.find(e => e.id === r.employeeId)
      const matchesSearch = emp?.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesEmp = selectedEmployee === 'All' || r.employeeId === selectedEmployee
      return matchesSearch && matchesEmp
    }).map(r => ({
      ...r,
      employeeName: employees.find(e => e.id === r.employeeId)?.name || 'Unknown'
    }))
  }, [leaveRequests, employees, searchTerm, selectedEmployee])

  const leaveKPIs = React.useMemo(() => {
    const total = leaveData.length
    const approved = leaveData.filter(r => r.status === 'Approved').length
    const totalDays = leaveData.filter(r => r.status === 'Approved').reduce((acc, r) => acc + r.totalDays, 0)
    return [
      { label: 'Total Requests', value: total, icon: CalendarDays, color: 'text-ds-brand-navy' },
      { label: 'Approved Requests', value: approved, icon: BarChart3, color: 'text-ds-brand-green' },
      { label: 'Total Days Taken', value: totalDays, icon: TrendingUp, color: 'text-ds-info-dark' },
    ]
  }, [leaveData])

  return (
    <div className="flex flex-col h-full space-y-6 max-w-7xl mx-auto w-full p-6 overflow-y-auto">
      <PageHeader 
        title="Reports & Analytics" 
        description="Monitor organization performance, attendance trends, and workforce insights."
        actions={
          <Button variant="outline">
            <Download className="size-4 mr-2" /> Export Report
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-ds-neutral-100 rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ReportType)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-ds-body-sm font-semibold transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-ds-brand-navy shadow-sm' 
                : 'text-ds-neutral-500 hover:text-ds-brand-navy'
            }`}
          >
            <tab.icon className="size-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(activeTab === 'attendance' ? attendanceKPIs : 
          activeTab === 'tasks' ? taskKPIs : 
          activeTab === 'performance' ? performanceKPIs : 
          leaveKPIs).map((kpi, i) => (
          <SectionCard key={i} className="flex flex-col">
            <div className="flex items-center gap-3 text-ds-neutral-500 mb-2">
              <kpi.icon className="size-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">{kpi.label}</span>
            </div>
            <span className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</span>
          </SectionCard>
        ))}
      </div>

      <SectionCard>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ds-neutral-400" />
            <Input 
              placeholder="Search by name or ID..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={selectedEmployee} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedEmployee(e.target.value)}>
              <option value="All">All Employees</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Input type="date" value={dateRange.start} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateRange(prev => ({ ...prev, start: e.target.value }))} className="w-40" />
            <span className="text-ds-neutral-400">to</span>
            <Input type="date" value={dateRange.end} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateRange(prev => ({ ...prev, end: e.target.value }))} className="w-40" />
          </div>
        </div>

        {/* Data Table */}
        {activeTab === 'attendance' && (
          <DataTable
            data={attendanceData}
            columns={[
              { id: 'date', accessorKey: 'date', header: 'Date', sortable: true },
              { id: 'employee', accessorKey: 'employeeName', header: 'Employee', sortable: true },
              { id: 'checkIn', accessorKey: 'checkIn', header: 'Check-in', cell: ({ row }) => row.checkIn ? <span suppressHydrationWarning>{new Date(row.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> : '-' },
              { id: 'status', accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.status} /> },
              { id: 'mode', accessorKey: 'mode', header: 'Mode', cell: ({ row }) => <span className="capitalize">{row.mode}</span> },
            ]}
            keyExtractor={r => r.id}
          />
        )}

        {activeTab === 'tasks' && (
          <DataTable
            data={taskData}
            columns={[
              { id: 'title', accessorKey: 'title', header: 'Task', sortable: true },
              { id: 'assignee', accessorKey: 'assignee.name', header: 'Assignee', sortable: true },
              { id: 'priority', accessorKey: 'priority', header: 'Priority', cell: ({ row }) => <SeverityBadge level={row.priority.charAt(0).toUpperCase() + row.priority.slice(1)} uppercase={false} /> },
              { id: 'status', accessorKey: 'status', header: 'Status', cell: ({ row }) => <span className="capitalize px-2 py-0.5 rounded-full bg-ds-neutral-100 text-ds-body-xs font-medium">{row.status.replace('_', ' ')}</span> },
              { id: 'dueDate', accessorKey: 'dueDate', header: 'Due Date', sortable: true, cell: ({ row }) => <span suppressHydrationWarning>{new Date(row.dueDate).toLocaleDateString()}</span> },
            ]}
            keyExtractor={t => t.id}
          />
        )}

        {activeTab === 'performance' && (
          <DataTable
            data={performanceData}
            columns={[
              { id: 'employee', accessorKey: 'employeeName', header: 'Employee', sortable: true },
              { id: 'period', accessorKey: 'period', header: 'Review Period' },
              { id: 'score', accessorKey: 'metrics.finalScore', header: 'Final Score', sortable: true, cell: ({ row }) => <span className="font-bold text-ds-brand-navy">{row.metrics.finalScore}%</span> },
              { id: 'category', accessorKey: 'metrics.category', header: 'Category', cell: ({ row }) => <StatusBadge status={row.metrics.category === 'Outstanding' ? 'Verified' : row.metrics.category === 'Needs Improvement' ? 'Failed' : 'Active'} /> },
            ]}
            keyExtractor={r => r.id}
          />
        )}

        {activeTab === 'leave' && (
          <DataTable
            data={leaveData}
            columns={[
              { id: 'employee', accessorKey: 'employeeName', header: 'Employee', sortable: true },
              { id: 'type', accessorKey: 'type', header: 'Type', sortable: true },
              { id: 'totalDays', accessorKey: 'totalDays', header: 'Days', sortable: true },
              { id: 'startDate', accessorKey: 'startDate', header: 'Start Date', sortable: true, cell: ({ row }) => <span suppressHydrationWarning>{new Date(row.startDate).toLocaleDateString()}</span> },
              { id: 'status', accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.status} /> },
            ]}
            keyExtractor={r => r.id}
          />
        )}
      </SectionCard>
    </div>
  )
}
