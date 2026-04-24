"use client"
import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { StoreProvider, useStore, UserRole } from '../store/StoreProvider'
import { LayoutDashboard, Users, CheckSquare, Clock, CalendarDays, Target, CheckCircle2, Boxes, FileText, BarChart3, Settings, Search, User, ChevronDown, Sparkles } from 'lucide-react'
import { NotificationDropdown } from '@/modules/notifications/components/NotificationDropdown'
import { Input, Select } from '@hryantra/ui'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AppShellInner>{children}</AppShellInner>
    </StoreProvider>
  )
}

function AppShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { currentUserRole, switchRole } = useStore()
  
  const navItems = React.useMemo(() => {
    const common = [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    ]

    const employee = [
      { label: 'Tasks', href: '/tasks', icon: CheckSquare },
      { label: 'Attendance', href: '/attendance', icon: Clock },
      { label: 'Leave', href: '/leave', icon: CalendarDays },
      { label: 'Documents', href: '/documents', icon: FileText },
    ]

    const manager = [
      { label: 'Team', href: '/employees', icon: Users },
      { label: 'Approvals', href: '/approvals', icon: CheckCircle2 },
      { label: 'Tasks', href: '/tasks', icon: CheckSquare },
      { label: 'Attendance', href: '/attendance', icon: Clock },
      { label: 'Documents', href: '/documents', icon: FileText },
    ]

    const hr = [
      { label: 'Employees', href: '/employees', icon: Users },
      { label: 'Onboarding', href: '/onboarding', icon: Sparkles },
      { label: 'Attendance', href: '/attendance', icon: Clock },
      { label: 'Leave', href: '/leave', icon: CalendarDays },
      { label: 'Assets', href: '/assets', icon: Boxes },
      { label: 'Performance', href: '/performance', icon: Target },
      { label: 'Approvals', href: '/approvals', icon: CheckCircle2 },
      { label: 'Documents', href: '/documents', icon: FileText },
      { label: 'Reports', href: '/reports', icon: BarChart3 },
      { label: 'Settings', href: '/settings', icon: Settings },
    ]

    if (currentUserRole === 'Employee') return [...common, ...employee]
    if (currentUserRole === 'Manager') return [...common, ...manager]
    return [...common, ...hr]
  }, [currentUserRole])
  
  return (
    <div className="flex h-screen w-full bg-ds-neutral-50 overflow-hidden">
        {/* Sidebar Nav */}
        <nav className="w-64 bg-ds-brand-navy shrink-0 border-r border-ds-brand-navy/60 flex flex-col">
          <div className="h-16 flex items-center px-6">
            <div className="text-white font-bold text-xl tracking-tight flex items-center gap-2">
              <div className="size-6 bg-ds-brand-green rounded flex items-center justify-center">
                <span className="text-ds-brand-navy text-xs font-black">Hr</span>
              </div>
              Yantra
            </div>
          </div>
          <div className="flex flex-col gap-1 px-4 mt-6">
            {navItems.map(item => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active ? 'bg-ds-brand-green text-ds-brand-navy' : 'text-ds-neutral-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="size-5" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Main Content Pane */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Header */}
          <header className="h-16 border-b border-ds-neutral-200 bg-white flex items-center justify-between px-6 shrink-0 z-40">
            <div className="relative w-64 md:w-96 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ds-neutral-400" />
              <Input placeholder="Search records..." className="pl-10 h-9 bg-ds-neutral-50/50" />
            </div>
            
            <div className="flex items-center gap-4">
              {/* Role Switcher (Dev Mode) */}
              <div className="flex items-center gap-2 px-3 py-1 bg-ds-brand-navy/[0.03] rounded-lg border border-ds-neutral-200">
                <span className="text-[10px] font-bold text-ds-neutral-400 uppercase tracking-widest">Role</span>
                <select 
                  className="bg-transparent text-ds-body-sm font-bold text-ds-brand-navy outline-none cursor-pointer"
                  value={currentUserRole}
                  onChange={(e) => switchRole(e.target.value as UserRole)}
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="HR">HR / Admin</option>
                </select>
              </div>

              <NotificationDropdown />
              <div className="h-8 w-px bg-ds-neutral-200 mx-1" />
              <div className="flex items-center gap-3 pl-1">
                <div className="flex flex-col items-end hidden md:flex">
                  <span className="text-ds-body-sm font-bold text-ds-brand-navy">Sarah Connor</span>
                  <span className="text-[10px] font-bold text-ds-neutral-400 uppercase tracking-wider">{currentUserRole === 'HR' ? 'HR Manager' : currentUserRole}</span>
                </div>
                <div className="size-9 rounded-full bg-ds-brand-navy text-white flex items-center justify-center font-bold text-sm border-2 border-ds-neutral-100 shadow-sm">
                  SC
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-hidden">
             {children}
          </div>
        </main>
      </div>
  )
}
