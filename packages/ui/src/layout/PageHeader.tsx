"use client"

import * as React from 'react'
import { cn } from '../utils'

// =============================================================================
// PageHeader — standard module page header
// Replaces inline h1 + description + actions pattern on every page.
//
// Usage:
//   <PageHeader
//     title="Employees"
//     description="Manage your global workforce roster."
//     actions={
//       <>
//         <Button variant="outline" onClick={openImport}>Import</Button>
//         <Button onClick={openAdd}>Add Employee</Button>
//       </>
//     }
//   />
//
//   // With breadcrumb:
//   <PageHeader
//     breadcrumb={<Breadcrumb />}
//     title="Edit Salary Template"
//   />
// =============================================================================

export interface PageHeaderProps {
  title: string
  description?: string
  /** Right-side action buttons */
  actions?: React.ReactNode
  /** Optional breadcrumb row above the title */
  breadcrumb?: React.ReactNode
  /** Optional badge next to the title (e.g., status or count) */
  badge?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  badge,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-1 mb-6', className)}>
      {breadcrumb && (
        <div className="mb-1 text-ds-body-sm text-ds-neutral-500">
          {breadcrumb}
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        {/* Left: title + description */}
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h1 className="text-ds-display font-bold text-ds-neutral-900 leading-tight truncate" suppressHydrationWarning>
              {title}
            </h1>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>
          {description && (
            <p className="mt-1 text-ds-body-sm text-ds-neutral-500" suppressHydrationWarning>{description}</p>
          )}
        </div>

        {/* Right: actions */}
        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
