"use client"

import * as React from 'react'
import { cn } from '../utils'

// =============================================================================
// SectionCard — the standard white content card used 20+ times across the app
//
// Replaces:
//   <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
//     <h3 className="text-[14px] font-bold text-gray-800 mb-4 pb-2 border-b">{title}</h3>
//     {children}
//   </div>
//
// Usage:
//   <SectionCard title="Personal Information">
//     <p>Content</p>
//   </SectionCard>
//
//   <SectionCard title="Earnings" titleAction={<Button size="xs">Edit</Button>}>
//     <EarningsTable />
//   </SectionCard>
//
//   <SectionCard>   ← no title — just a plain card wrapper
//     <p>Content</p>
//   </SectionCard>
// =============================================================================

export interface SectionCardProps {
  title?: string
  /** Optional element rendered to the right of the title (e.g., Edit button, badge) */
  titleAction?: React.ReactNode
  children: React.ReactNode
  className?: string
  /** Inner body padding override */
  bodyClassName?: string
  /** Remove default padding from body (e.g., for a full-bleed table) */
  noPadding?: boolean
}

export function SectionCard({
  title,
  titleAction,
  children,
  className,
  bodyClassName,
  noPadding = false,
}: SectionCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-ds-neutral-200 shadow-sm overflow-hidden',
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-ds-neutral-100">
          <h3 className="text-ds-heading-sm font-bold text-ds-neutral-900">
            {title}
          </h3>
          {titleAction && <div>{titleAction}</div>}
        </div>
      )}

      <div className={cn(!noPadding && 'p-5', bodyClassName)}>
        {children}
      </div>
    </div>
  )
}
