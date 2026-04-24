"use client"
import * as React from 'react'
import { PageHeader, SectionCard, DataTable, Button, StatusBadge, SeverityBadge } from '@hryantra/ui'
import { useStore } from '@/store/StoreProvider'
import { UserPlus, CheckCircle2, Clock, UserCheck, Mail, FileText, Briefcase } from 'lucide-react'

export default function OnboardingPage() {
  const { employees, currentUserRole } = useStore()

  if (currentUserRole !== 'HR') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-ds-neutral-50">
        <Briefcase className="size-16 text-ds-neutral-200 mb-4" />
        <h3 className="text-ds-heading text-ds-brand-navy">Onboarding Restricted</h3>
        <p className="text-ds-body text-ds-neutral-500 max-w-md">The onboarding management module is only accessible to HR and Administrators.</p>
      </div>
    )
  }

  // Mock onboarding data
  const onboardingHires = [
    { id: 'H-001', name: 'John Connor', role: 'Full Stack Engineer', department: 'Engineering', progress: 65, joinDate: '2024-05-15', status: 'In Progress' },
    { id: 'H-002', name: 'Kyle Reese', role: 'Security Specialist', department: 'IT', progress: 20, joinDate: '2024-05-20', status: 'Pending' },
    { id: 'H-003', name: 'T-800', role: 'Hardware Architect', department: 'R&D', progress: 100, joinDate: '2024-05-01', status: 'Completed' },
  ]

  const stats = [
    { label: 'New Hires', value: '8', icon: UserPlus, color: 'text-ds-brand-navy' },
    { label: 'In Progress', value: '5', icon: Clock, color: 'text-ds-info-dark' },
    { label: 'Completed', value: '3', icon: UserCheck, color: 'text-ds-brand-green' },
  ]

  return (
    <div className="flex flex-col h-full space-y-6 max-w-7xl mx-auto w-full p-6 overflow-y-auto">
      <PageHeader 
        title="Employee Onboarding" 
        description="Streamline the transition of new hires into the organization with structured workflows."
        actions={
          <Button variant="default">
            <UserPlus className="size-4 mr-2" /> Initiate Onboarding
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(s => (
          <SectionCard key={s.label} className="flex flex-col">
            <div className="flex items-center gap-3 text-ds-neutral-500 mb-2">
              <s.icon className="size-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">{s.label}</span>
            </div>
            <span className={`text-3xl font-bold ${s.color}`}>{s.value}</span>
          </SectionCard>
        ))}
      </div>

      <SectionCard title="Active Onboarding Pipelines">
        <DataTable 
          data={onboardingHires}
          columns={[
            { id: 'employee', header: 'New Hire', cell: ({ row }) => (
              <div className="flex flex-col">
                <span className="text-ds-body-sm font-bold text-ds-brand-navy">{row.name}</span>
                <span className="text-ds-caption text-ds-neutral-500">{row.role} • {row.department}</span>
              </div>
            )},
            { id: 'progress', header: 'Progress', width: 200, cell: ({ row }) => (
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-ds-neutral-100 rounded-full overflow-hidden">
                  <div className={`h-full transition-all ${row.progress === 100 ? 'bg-ds-brand-green' : 'bg-ds-info-dark'}`} style={{ width: `${row.progress}%` }} />
                </div>
                <span className="text-[11px] font-bold text-ds-brand-navy">{row.progress}%</span>
              </div>
            )},
            { id: 'joinDate', header: 'Join Date', cell: ({ row }) => <span suppressHydrationWarning>{row.joinDate}</span> },
            { id: 'status', header: 'Status', cell: ({ row }) => (
              <StatusBadge status={row.status === 'Completed' ? 'Verified' : row.status === 'In Progress' ? 'Active' : 'Draft'} />
            )},
            { id: 'actions', header: '', cell: () => (
              <div className="flex justify-end">
                <Button variant="ghost" size="sm">Manage Tasks</Button>
              </div>
            )}
          ]}
          keyExtractor={r => r.id}
        />
      </SectionCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <SectionCard title="Onboarding Checklist (Default)">
            <div className="space-y-4">
               {[
                 { label: 'Hardware Allocation', done: true },
                 { id: 'C-2', label: 'Email & Workspace Setup', done: true },
                 { id: 'C-3', label: 'Policy Documentation Signature', done: false },
                 { id: 'C-4', label: 'Induction Meeting', done: false },
                 { id: 'C-5', label: 'Team Introduction', done: false },
               ].map(item => (
                 <div key={item.label} className="flex items-center justify-between p-3 border border-ds-neutral-100 rounded-lg bg-ds-neutral-50/50">
                    <span className={`text-ds-body-sm ${item.done ? 'text-ds-neutral-400 line-through' : 'text-ds-brand-navy font-medium'}`}>{item.label}</span>
                    {item.done ? <CheckCircle2 className="size-4 text-ds-brand-green" /> : <div className="size-4 rounded border border-ds-neutral-300" />}
                 </div>
               ))}
            </div>
         </SectionCard>

         <SectionCard title="Resource Links">
            <div className="flex flex-col gap-3">
               <div className="p-4 border border-ds-neutral-200 rounded-xl hover:bg-ds-neutral-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                     <Mail className="size-5 text-ds-info-dark" />
                     <div className="flex flex-col">
                        <span className="text-ds-body-sm font-bold text-ds-brand-navy">Welcome Email Template</span>
                        <span className="text-ds-caption text-ds-neutral-500">Standardized outreach for day-one hires.</span>
                     </div>
                  </div>
               </div>
               <div className="p-4 border border-ds-neutral-200 rounded-xl hover:bg-ds-neutral-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                     <FileText className="size-5 text-ds-brand-green" />
                     <div className="flex flex-col">
                        <span className="text-ds-body-sm font-bold text-ds-brand-navy">Employee Handbook</span>
                        <span className="text-ds-caption text-ds-neutral-500">Company policies and culture guide.</span>
                     </div>
                  </div>
               </div>
            </div>
         </SectionCard>
      </div>
    </div>
  )
}
