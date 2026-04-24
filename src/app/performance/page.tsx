"use client"
import * as React from 'react'
import { PageHeader, SectionCard, StatusBadge, Button } from '@hryantra/ui'
import { useStore, CURRENT_USER_ID } from '@/store/StoreProvider'
import { Target, TrendingUp, Users, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PerformanceDashboardPage() {
  const { performanceReviews, employees } = useStore()
  const router = useRouter()

  const completedReviews = performanceReviews.filter(r => r.status === 'Completed')
  const pendingReviews = performanceReviews.filter(r => r.status !== 'Completed')
  
  const avgScore = completedReviews.length > 0 
    ? Math.round(completedReviews.reduce((sum, r) => sum + r.metrics.finalScore, 0) / completedReviews.length)
    : 0

  return (
    <div className="flex flex-col h-full space-y-6 max-w-7xl mx-auto w-full p-6 overflow-y-auto">
      <PageHeader 
        title="Performance Management" 
      />

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <SectionCard className="flex flex-col">
          <div className="flex items-center gap-3 text-ds-neutral-500 mb-2">
            <TrendingUp className="size-5" />
            <span className="text-ds-label uppercase font-semibold">Avg. Score</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-ds-brand-navy">{avgScore}</span>
            <span className="text-ds-body-sm text-ds-brand-green mb-1">/100</span>
          </div>
        </SectionCard>
        
        <SectionCard className="flex flex-col">
          <div className="flex items-center gap-3 text-emerald-600 mb-2">
            <CheckCircle className="size-5" />
            <span className="text-ds-label uppercase font-semibold">Completed Reviews</span>
          </div>
          <span className="text-3xl font-bold text-ds-brand-navy">{completedReviews.length}</span>
        </SectionCard>

        <SectionCard className="flex flex-col border-amber-200 bg-amber-50/30">
          <div className="flex items-center gap-3 text-amber-600 mb-2">
            <Target className="size-5" />
            <span className="text-ds-label uppercase font-semibold">Pending Actions</span>
          </div>
          <span className="text-3xl font-bold text-amber-700">{pendingReviews.length}</span>
        </SectionCard>

        <SectionCard className="flex flex-col">
          <div className="flex items-center gap-3 text-ds-info-dark mb-2">
            <Users className="size-5" />
            <span className="text-ds-label uppercase font-semibold">Eligible Employees</span>
          </div>
          <span className="text-3xl font-bold text-ds-brand-navy">{employees.length}</span>
        </SectionCard>
      </div>

      {/* Review List */}
      <SectionCard title="Team Performance Overview" className="flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-ds-neutral-200 text-ds-label text-ds-neutral-500">
                <th className="py-3 px-4 font-semibold uppercase">Employee</th>
                <th className="py-3 px-4 font-semibold uppercase">Role</th>
                <th className="py-3 px-4 font-semibold uppercase">Status</th>
                <th className="py-3 px-4 font-semibold uppercase text-right">Score</th>
                <th className="py-3 px-4 font-semibold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {performanceReviews.map(review => {
                const emp = employees.find(e => e.id === review.employeeId)
                if (!emp) return null
                return (
                  <tr key={review.id} className="border-b border-ds-neutral-100 hover:bg-ds-neutral-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-ds-brand-navy text-white flex items-center justify-center font-bold text-xs">
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-ds-body-sm font-semibold text-ds-brand-navy">{emp.name}</span>
                          <span className="text-ds-caption text-ds-neutral-500">{emp.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-ds-body-sm text-ds-neutral-600">{emp.designation}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={review.status === 'Completed' ? 'Approved' : 'Pending'} />
                      {review.status !== 'Completed' && (
                        <div className="text-[10px] text-ds-neutral-500 mt-1">{review.status}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {review.status === 'Completed' ? (
                         <div className="flex flex-col items-end">
                            <span className="text-ds-body font-bold text-ds-brand-green">{review.metrics.finalScore}</span>
                            <span className="text-[10px] text-ds-neutral-500 font-medium">{review.metrics.category}</span>
                         </div>
                      ) : (
                        <span className="text-ds-caption text-ds-neutral-400">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/employees/${emp.id}`)}>View Profile</Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {performanceReviews.length === 0 && (
            <div className="py-8 text-center text-ds-body text-ds-neutral-500">No performance cycles currently active.</div>
          )}
        </div>
      </SectionCard>
    </div>
  )
}
