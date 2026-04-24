"use client"
import * as React from 'react'
import { PageHeader, SectionCard, Button, FormField, FormFieldInput, Input, Select, Textarea, FormGrid } from '@hryantra/ui'
import { useStore } from '@/store/StoreProvider'
import { Settings, Building2, CalendarDays, Clock, Target, ShieldCheck, Save, Check } from 'lucide-react'

type SettingsTab = 'organization' | 'leave' | 'attendance' | 'performance' | 'roles'

export default function SettingsPage() {
  const { currentUserRole } = useStore()
  const [activeTab, setActiveTab] = React.useState<SettingsTab>('organization')
  const [isSaving, setIsSaving] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)

  if (currentUserRole !== 'HR') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-ds-neutral-50">
        <ShieldCheck className="size-16 text-ds-neutral-200 mb-4" />
        <h3 className="text-ds-heading text-ds-brand-navy">Settings Restricted</h3>
        <p className="text-ds-body text-ds-neutral-500 max-w-md">System configuration and organization settings are restricted to HR and Administrators.</p>
      </div>
    )
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 800)
  }

  const tabs = [
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'leave', label: 'Leave Policies', icon: CalendarDays },
    { id: 'attendance', label: 'Attendance Rules', icon: Clock },
    { id: 'performance', label: 'Performance Config', icon: Target },
    { id: 'roles', label: 'Roles & Permissions', icon: ShieldCheck },
  ]

  return (
    <div className="flex flex-col h-full space-y-6 max-w-7xl mx-auto w-full p-6 overflow-y-auto">
      <PageHeader 
        title="Settings & Configuration" 
        description="Manage system-wide rules, company policies, and organizational preferences."
        actions={
          <Button variant="default" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : showSuccess ? <><Check className="size-4 mr-2" /> Saved</> : <><Save className="size-4 mr-2" /> Save Changes</>}
          </Button>
        }
      />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 shrink-0">
          <SectionCard className="p-2">
            <nav className="flex flex-col gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-ds-body-sm font-semibold transition-all ${
                    activeTab === tab.id 
                      ? 'bg-ds-brand-navy text-white shadow-sm' 
                      : 'text-ds-neutral-500 hover:bg-ds-neutral-100 hover:text-ds-brand-navy'
                  }`}
                >
                  <tab.icon className="size-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </SectionCard>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <SectionCard>
            {activeTab === 'organization' && <OrganizationSettings />}
            {activeTab === 'leave' && <LeaveSettings />}
            {activeTab === 'attendance' && <AttendanceSettings />}
            {activeTab === 'performance' && <PerformanceSettings />}
            {activeTab === 'roles' && <RoleSettings />}
          </SectionCard>
        </div>
      </div>
    </div>
  )
}

function OrganizationSettings() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-ds-neutral-100">
        <h3 className="text-ds-heading-sm font-bold text-ds-brand-navy">Organization Settings</h3>
        <p className="text-ds-body-xs text-ds-neutral-500 mt-0.5">Basic details and branding for your company.</p>
      </div>
      
      <FormGrid cols={2}>
        <FormField label="Company Name">
          <FormFieldInput>
            <Input defaultValue="HrYantra Corp" />
          </FormFieldInput>
        </FormField>
        <FormField label="Website">
          <FormFieldInput>
            <Input defaultValue="https://hryantra.com" />
          </FormFieldInput>
        </FormField>
        <FormField label="Tax ID / Registration">
          <FormFieldInput>
            <Input defaultValue="TX-992-110" />
          </FormFieldInput>
        </FormField>
        <FormField label="Primary Currency">
          <FormFieldInput>
            <Select defaultValue="USD">
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </Select>
          </FormFieldInput>
        </FormField>
        <FormField label="Timezone">
          <FormFieldInput>
            <Select defaultValue="GMT-5">
              <option value="GMT-5">EST (GMT-5)</option>
              <option value="GMT+0">UTC (GMT+0)</option>
              <option value="GMT+5.5">IST (GMT+5.5)</option>
            </Select>
          </FormFieldInput>
        </FormField>
      </FormGrid>
      
      <FormField label="Company Address">
        <FormFieldInput>
          <Textarea rows={3} defaultValue="101 Innovation Way, Tech District, San Francisco, CA 94105" />
        </FormFieldInput>
      </FormField>
    </div>
  )
}

function LeaveSettings() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-ds-neutral-100">
        <h3 className="text-ds-heading-sm font-bold text-ds-brand-navy">Leave Policies</h3>
        <p className="text-ds-body-xs text-ds-neutral-500 mt-0.5">Define annual limits and carry-forward rules.</p>
      </div>

      <FormGrid cols={2}>
        <FormField label="Annual Sick Leave (Days)">
          <FormFieldInput>
            <Input type="number" defaultValue="12" />
          </FormFieldInput>
        </FormField>
        <FormField label="Annual Casual Leave (Days)">
          <FormFieldInput>
            <Input type="number" defaultValue="15" />
          </FormFieldInput>
        </FormField>
        <FormField label="Carry Forward Limit (Days)">
          <FormFieldInput>
            <Input type="number" defaultValue="5" />
          </FormFieldInput>
        </FormField>
        <FormField label="Notice Period for Leave (Days)">
          <FormFieldInput>
            <Input type="number" defaultValue="3" />
          </FormFieldInput>
        </FormField>
      </FormGrid>

      <div className="flex items-center gap-3 p-4 bg-ds-neutral-50 rounded-xl border border-ds-neutral-200">
         <div className="flex flex-col flex-1">
            <span className="text-ds-body-sm font-semibold text-ds-brand-navy">Enable Auto-Approval</span>
            <span className="text-ds-caption text-ds-neutral-500">Automatically approve leave requests under 2 days.</span>
         </div>
         <div className="size-11 rounded-lg bg-white border border-ds-neutral-200 flex items-center justify-center cursor-pointer hover:border-ds-brand-green">
            <div className="size-5 rounded bg-ds-brand-green"></div>
         </div>
      </div>
    </div>
  )
}

function AttendanceSettings() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-ds-neutral-100">
        <h3 className="text-ds-heading-sm font-bold text-ds-brand-navy">Attendance Rules</h3>
        <p className="text-ds-body-xs text-ds-neutral-500 mt-0.5">Working hours, shift timings, and remote work settings.</p>
      </div>

      <FormGrid cols={2}>
        <FormField label="Standard Shift Start">
          <FormFieldInput>
            <Input type="time" defaultValue="09:00" />
          </FormFieldInput>
        </FormField>
        <FormField label="Standard Shift End">
          <FormFieldInput>
            <Input type="time" defaultValue="18:00" />
          </FormFieldInput>
        </FormField>
        <FormField label="Late Arrival Grace (Minutes)">
          <FormFieldInput>
            <Input type="number" defaultValue="15" />
          </FormFieldInput>
        </FormField>
        <FormField label="Half-day Threshold (Hours)">
          <FormFieldInput>
            <Input type="number" defaultValue="4" />
          </FormFieldInput>
        </FormField>
      </FormGrid>

      <div className="space-y-3">
         <h4 className="text-[11px] font-bold text-ds-neutral-400 uppercase tracking-wider">Remote Work Policy</h4>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-ds-brand-green bg-ds-brand-green/5 rounded-xl flex items-center justify-between">
               <span className="text-ds-body-sm font-semibold text-ds-brand-navy">Office-Only Days</span>
               <span className="text-ds-caption font-bold text-ds-brand-navy bg-ds-brand-green px-2 py-0.5 rounded">Mon, Wed</span>
            </div>
            <div className="p-4 border border-ds-neutral-200 rounded-xl flex items-center justify-between">
               <span className="text-ds-body-sm font-semibold text-ds-neutral-500">Require Location Tracking</span>
               <div className="size-5 rounded border border-ds-neutral-300 bg-white"></div>
            </div>
         </div>
      </div>
    </div>
  )
}

function PerformanceSettings() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-ds-neutral-100">
        <h3 className="text-ds-heading-sm font-bold text-ds-brand-navy">Performance Configuration</h3>
        <p className="text-ds-body-xs text-ds-neutral-500 mt-0.5">Review cycles, scoring weights, and assessment types.</p>
      </div>

      <FormGrid cols={2}>
        <FormField label="Review Frequency">
          <FormFieldInput>
            <Select defaultValue="Quarterly">
              <option value="Quarterly">Quarterly</option>
              <option value="Biannual">Bi-Annual</option>
              <option value="Yearly">Yearly</option>
            </Select>
          </FormFieldInput>
        </FormField>
        <FormField label="Rating Scale">
          <FormFieldInput>
            <Select defaultValue="5">
              <option value="3">1 - 3 (Simple)</option>
              <option value="5">1 - 5 (Standard)</option>
              <option value="10">1 - 10 (Detailed)</option>
            </Select>
          </FormFieldInput>
        </FormField>
      </FormGrid>

      <div className="space-y-4">
         <h4 className="text-[11px] font-bold text-ds-neutral-400 uppercase tracking-wider">Score Weights</h4>
         <div className="space-y-4 bg-ds-neutral-50 p-5 rounded-xl border border-ds-neutral-200">
            {[
              { label: 'Task Completion', weight: '40%' },
              { label: 'Attendance & Punctuality', weight: '20%' },
              { label: 'Manager Subjective Feedback', weight: '30%' },
              { label: 'Peer Feedback', weight: '10%' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-ds-body-sm text-ds-neutral-700">{item.label}</span>
                <span className="text-ds-body-sm font-bold text-ds-brand-navy">{item.weight}</span>
              </div>
            ))}
         </div>
      </div>
    </div>
  )
}

function RoleSettings() {
  const roles = [
    { id: 1, name: 'Super Admin', desc: 'Full system access', members: 2 },
    { id: 2, name: 'HR Manager', desc: 'Employee, Leave, and Assets access', members: 5 },
    { id: 3, name: 'Team Lead', desc: 'Can manage own team tasks and attendance', members: 12 },
    { id: 4, name: 'Employee', desc: 'Self-service portal access only', members: 84 },
  ]

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-ds-neutral-100 flex justify-between items-end">
        <div>
          <h3 className="text-ds-heading-sm font-bold text-ds-brand-navy">Roles & Permissions</h3>
          <p className="text-ds-body-xs text-ds-neutral-500 mt-0.5">Manage user groups and access levels.</p>
        </div>
        <Button variant="outline" size="sm">Create New Role</Button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {roles.map(role => (
          <div key={role.id} className="p-4 border border-ds-neutral-200 rounded-xl hover:border-ds-brand-green/50 hover:bg-ds-neutral-50/50 transition-all group flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-ds-brand-navy/5 text-ds-brand-navy flex items-center justify-center font-bold">
                  {role.members}
                </div>
                <div>
                  <h4 className="text-ds-body-sm font-bold text-ds-brand-navy">{role.name}</h4>
                  <p className="text-ds-caption text-ds-neutral-500">{role.desc}</p>
                </div>
             </div>
             <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">Edit Permissions</Button>
          </div>
        ))}
      </div>
    </div>
  )
}
