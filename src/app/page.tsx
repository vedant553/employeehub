"use client"
import * as React from 'react'
import { PageHeader, SectionCard, StatusBadge, SeverityBadge, Button, DataTable } from '@hryantra/ui'
import { useStore, CURRENT_USER_ID } from '@/store/StoreProvider'
import { useRouter } from 'next/navigation'
import { 
  Users, CheckSquare, AlertTriangle, CheckCircle2, Clock, Target, 
  BarChart3, CalendarDays, ArrowUpRight, TrendingUp, Bell, FileText 
} from 'lucide-react'

// Locale-pinned formatters — must be identical on server and client to avoid hydration mismatch
const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

// =============================================================================
// Dashboard Sub-components
// =============================================================================

function KPICard({ label, value, icon: Icon, color, trend }: any) {
  return (
    <SectionCard className="flex flex-col relative overflow-hidden group">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`size-5 ${color.replace('bg-', 'text-')}`} />
        </div>
        {trend && (
          <div className="flex items-center gap-0.5 text-ds-brand-green text-[10px] font-bold">
            <ArrowUpRight className="size-3" /> {trend}
          </div>
        )}
      </div>
      <span className="text-3xl font-bold text-ds-brand-navy mb-1">{value}</span>
      <span className="text-ds-label uppercase font-bold text-ds-neutral-400 tracking-wider">{label}</span>
      <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-300 ${color}`} />
    </SectionCard>
  )
}

// =============================================================================
// Main Dashboard Page
// =============================================================================

export default function DashboardPage() {
  const { 
    tasks, employees, performanceReviews, attendanceRecords, 
    leaveRequests, remoteRequests, currentUserRole, notifications 
  } = useStore()
  const router = useRouter()

  // --- Common Calculations ---
  const today = new Date().toISOString().split('T')[0]
  const pendingApprovalsCount = 
    leaveRequests.filter(r => r.status === 'Pending').length + 
    remoteRequests.filter(r => r.status === 'Pending').length
  
  const todayAttendance = attendanceRecords.filter(r => r.date === today)
  const attendanceRate = employees.length > 0 
    ? Math.round((todayAttendance.length / employees.length) * 100) 
    : 0

  const myTasks = tasks.filter(t => t.assignee.id === CURRENT_USER_ID)
  const activeTasksCount = tasks.filter(t => t.status !== 'completed').length

  const greeting = React.useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }, [])

  // --- Alerts / Action Items ---
  const alerts = React.useMemo(() => {
    const items: { id: string; type: string; title: string; severity: string; date: string }[] = []
    
    // Overdue Tasks
    const overdue = tasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date())
    overdue.forEach(t => items.push({ id: t.id, type: 'Task', title: `Overdue: ${t.title}`, severity: 'High', date: t.dueDate }))

    // Pending Approvals (for Managers/HR)
    if (currentUserRole !== 'Employee') {
      const pendingLeave = leaveRequests.filter(r => r.status === 'Pending')
      pendingLeave.forEach(r => items.push({ id: r.id, type: 'Leave', title: `Pending Approval: ${r.type}`, severity: 'Medium', date: r.createdAt }))
    }

    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
  }, [tasks, leaveRequests, currentUserRole])

  return (
    <div className="flex flex-col space-y-6 p-6 max-w-7xl mx-auto w-full h-full overflow-y-auto bg-ds-neutral-50/30">
      <PageHeader 
        title={`${greeting}, Sarah`} 
        description={
          currentUserRole === 'HR' ? "Enterprise-wide oversight and strategic HR analytics." :
          currentUserRole === 'Manager' ? "Team performance tracking and operational approvals." :
          "Your personalized workspace and daily performance summary."
        }
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/notifications')}>
              <Bell className="size-4 mr-2" /> 
              {notifications.filter(n => !n.isRead).length} New Alerts
            </Button>
            <Button variant="default" onClick={() => router.push('/tasks')}>
               Manage Workflow
            </Button>
          </div>
        }
      />

      {/* 1. Global KPIs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {currentUserRole === 'HR' ? (
          <>
            <KPICard label="Total Headcount" value={employees.length} icon={Users} color="bg-ds-brand-navy" trend="+2% this mo" />
            <KPICard label="Org Attendance" value={`${attendanceRate}%`} icon={Clock} color="bg-ds-brand-green" />
            <KPICard label="Active Tasks" value={activeTasksCount} icon={CheckSquare} color="bg-ds-info-dark" />
            <KPICard label="Avg Perf Score" value="84%" icon={Target} color="bg-ds-brand-green" />
            <KPICard label="Pending Actions" value={pendingApprovalsCount} icon={Bell} color="bg-ds-danger" />
          </>
        ) : currentUserRole === 'Manager' ? (
          <>
            <KPICard label="Team Members" value={employees.length} icon={Users} color="bg-ds-brand-navy" />
            <KPICard label="Team Attendance" value={`${attendanceRate}%`} icon={Clock} color="bg-ds-brand-green" />
            <KPICard label="Open Tasks" value={activeTasksCount} icon={CheckSquare} color="bg-ds-info-dark" />
            <KPICard label="Pending Approvals" value={pendingApprovalsCount} icon={CheckCircle2} color="bg-ds-brand-green" />
            <KPICard label="Team Velocity" value="92%" icon={TrendingUp} color="bg-ds-brand-green" />
          </>
        ) : (
          <>
            <KPICard label="My Active Tasks" value={myTasks.filter(t => t.status !== 'completed').length} icon={CheckSquare} color="bg-ds-info-dark" />
            <KPICard label="Attendance Goal" value="98%" icon={Clock} color="bg-ds-brand-green" />
            <KPICard label="My Perf Score" value="88%" icon={Target} color="bg-ds-brand-green" />
            <KPICard label="Completed" value={myTasks.filter(t => t.status === 'completed').length} icon={CheckCircle2} color="bg-ds-success-text" />
            <KPICard label="New Alerts" value={notifications.filter(n => !n.isRead).length} icon={Bell} color="bg-ds-danger" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Actionable Alerts & Tasks (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Priority Alerts */}
          <SectionCard title="Priority Alerts & Actions" className="border-l-4 border-l-ds-danger">
            <div className="flex flex-col gap-1">
              {alerts.length === 0 ? (
                <div className="py-4 text-center text-ds-neutral-400 text-ds-body-sm">All systems clear. No immediate alerts.</div>
              ) : (
                alerts.map(alert => (
                  <div key={alert.id} className="flex items-center justify-between p-3 hover:bg-ds-neutral-50 rounded-lg transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-full ${alert.severity === 'High' ? 'bg-ds-danger/10 text-ds-danger' : 'bg-amber-50 text-amber-600'}`}>
                        <AlertTriangle className="size-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-ds-body-sm font-bold text-ds-brand-navy">{alert.title}</span>
                        <span className="text-[10px] text-ds-neutral-400 uppercase font-bold tracking-wider">{alert.type} • Due {formatDate(alert.date)}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="xs" className="opacity-0 group-hover:opacity-100 transition-opacity">Resolve</Button>
                  </div>
                ))
              )}
            </div>
          </SectionCard>

          {/* Core Table View (Task Overview or Employee Snapshot) */}
          <SectionCard title={currentUserRole === 'HR' ? "Recent Organization Activity" : "Active Workflow Items"}>
             {currentUserRole === 'HR' ? (
               <DataTable<any> 
                 data={employees.slice(0, 5)}
                 columns={[
                   { id: 'name', accessorKey: 'name', header: 'Employee' },
                   { id: 'role', accessorKey: 'role', header: 'Role' },
                   { id: 'status', accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.status} /> },
                   { id: 'joinDate', accessorKey: 'joinDate', header: 'Join Date', cell: ({ row }) => <span >{formatDate(row.joinDate)}</span> }
                 ]}
                 keyExtractor={(r) => r.id}
               />
             ) : (
               <DataTable<any>
                 data={tasks.filter(t => t.status !== 'completed').slice(0, 5)}
                 columns={[
                   { id: 'title', accessorKey: 'title', header: 'Task' },
                   { id: 'assignee', accessorKey: 'assignee.name', header: 'Assignee' },
                   { id: 'priority', accessorKey: 'priority', header: 'Priority', cell: ({ row }) => <SeverityBadge level={row.priority.charAt(0).toUpperCase() + row.priority.slice(1)} /> },
                   { id: 'status', accessorKey: 'status', header: 'Status', cell: ({ row }) => <span className="capitalize">{row.status.replace('_', ' ')}</span> }
                 ]}
                 keyExtractor={(r) => r.id}
               />
             )}
             <div className="mt-4 pt-4 border-t border-ds-neutral-100 text-center">
                <Button variant="link" size="sm" onClick={() => router.push(currentUserRole === 'HR' ? '/employees' : '/tasks')}>
                  View All {currentUserRole === 'HR' ? 'Employees' : 'Tasks'} <ArrowUpRight className="size-3.5 ml-1" />
                </Button>
             </div>
          </SectionCard>
        </div>

        {/* Right Column: Summaries & Trends (1/3 width) */}
        <div className="flex flex-col gap-6">
          
          {/* Quick Stats / Trends */}
          <SectionCard title="Operational Summary">
             <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center pb-2 border-b border-ds-neutral-100">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-ds-brand-green" />
                    <span className="text-ds-body-sm text-ds-neutral-600">On-time Attendance</span>
                  </div>
                  <span className="font-bold text-ds-brand-navy">94.2%</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-ds-neutral-100">
                  <div className="flex items-center gap-2">
                    <Target className="size-4 text-ds-info-dark" />
                    <span className="text-ds-body-sm text-ds-neutral-600">Project Progress</span>
                  </div>
                  <span className="font-bold text-ds-brand-navy">78%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-ds-brand-navy" />
                    <span className="text-ds-body-sm text-ds-neutral-600">Team Satisfaction</span>
                  </div>
                  <span className="font-bold text-ds-brand-navy">4.8/5</span>
                </div>
             </div>
          </SectionCard>

          {/* Role-Specific Summary Panel */}
          <SectionCard title={currentUserRole === 'HR' ? "Org Performance" : "Quick Actions"}>
            {currentUserRole === 'HR' ? (
              <div className="space-y-4">
                <div className="h-32 bg-ds-neutral-50 rounded-lg flex items-center justify-center border border-dashed border-ds-neutral-200">
                   <div className="text-center">
                      <BarChart3 className="size-8 text-ds-neutral-300 mx-auto mb-2" />
                      <span className="text-ds-caption text-ds-neutral-400">Score Distribution Graph</span>
                   </div>
                </div>
                <div className="flex items-center justify-between px-2">
                   <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-ds-brand-navy">12</span>
                      <span className="text-[10px] uppercase font-bold text-ds-neutral-400">High</span>
                   </div>
                   <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-ds-brand-navy">45</span>
                      <span className="text-[10px] uppercase font-bold text-ds-neutral-400">Stable</span>
                   </div>
                   <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-ds-brand-navy">4</span>
                      <span className="text-[10px] uppercase font-bold text-ds-neutral-400">Low</span>
                   </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" onClick={() => router.push('/leave')}>Apply Leave</Button>
                <Button variant="outline" size="sm" onClick={() => router.push('/attendance')}>Check In</Button>
                <Button variant="outline" size="sm" onClick={() => router.push('/documents')}>My Files</Button>
                <Button variant="outline" size="sm" onClick={() => router.push('/performance')}>Self Review</Button>
              </div>
            )}
          </SectionCard>

          {/* Recent Activity Mini-Feed */}
          <SectionCard title="Recent Activity">
            <div className="flex flex-col gap-3">
               {notifications.slice(0, 3).map(n => (
                 <div key={n.id} className="flex gap-3 pb-3 border-b border-ds-neutral-50 last:border-0 last:pb-0">
                    <div className="size-8 rounded-full bg-ds-neutral-100 flex items-center justify-center shrink-0">
                      <FileText className="size-4 text-ds-neutral-400" />
                    </div>
                    <div className="flex flex-col min-w-0">
                       <span className="text-ds-caption font-bold text-ds-brand-navy truncate">{n.title}</span>
                       <span className="text-[10px] text-ds-neutral-400">{formatTime(n.createdAt)}</span>
                    </div>
                 </div>
               ))}
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  )
}
