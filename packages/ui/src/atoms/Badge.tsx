"use client"

import { cn } from '../utils'

// =============================================================================
// StatusBadge — entity/record status pill
// Replaces 8+ inline conditional className strings across the app.
//
// ⚠️  ARCHITECTURAL NOTE — hex values in lookup maps are INTENTIONAL:
//     Tailwind purges classes it cannot statically find in source files.
//     A lookup map like STATUS_MAP['Active'] is evaluated at runtime —
//     Tailwind's static scanner cannot see the result. If we wrote
//     `bg-ds-success-light` into a JS variable, it would be purged.
//     The correct pattern for runtime-selected classes is:
//       1. Keep full class strings in the map (what we do here), OR
//       2. Use CSS variables with inline style (over-engineered for this case)
//     These hex values ARE sourced from tokens/colors.ts — changes must be
//     updated here when the token file changes.
//
// Usage:
//   <StatusBadge status="Active" />
//   <StatusBadge status="Inactive" />
//   <StatusBadge status="On Leave" withDot />
// =============================================================================

const STATUS_MAP: Record<string, { bg: string; text: string; dot?: string }> = {
  // ── Green states (→ ds.success)
  'Active':         { bg: 'bg-[#d1fae5]', text: 'text-[#065f46]', dot: 'bg-[#10b981]' },
  'Compliant':      { bg: 'bg-[#d1fae5]', text: 'text-[#065f46]', dot: 'bg-[#10b981]' },
  'Paid':           { bg: 'bg-[#d1fae5]', text: 'text-[#065f46]', dot: 'bg-[#10b981]' },
  'Valid':          { bg: 'bg-[#d1fae5]', text: 'text-[#065f46]', dot: 'bg-[#10b981]' },
  'Verified':       { bg: 'bg-[#d1fae5]', text: 'text-[#065f46]', dot: 'bg-[#10b981]' },
  'Resolved':       { bg: 'bg-[#d1fae5]', text: 'text-[#065f46]', dot: 'bg-[#10b981]' },
  'Auto-Resolved':  { bg: 'bg-[#d1fae5]', text: 'text-[#065f46]', dot: 'bg-[#10b981]' },
  'Present':        { bg: 'bg-[#d1fae5]', text: 'text-[#065f46]' },

  // ── Amber/Yellow states (→ ds.warning)
  'On Leave':        { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]', dot: 'bg-[#f59e0b]' },
  'Pending':         { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]', dot: 'bg-[#f59e0b]' },
  'Action Required': { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]', dot: 'bg-[#f59e0b]' },
  'Late':            { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]' },
  'Missing Data':    { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]' },
  'In Progress':     { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]', dot: 'bg-[#f59e0b]' },

  // ── Red states (→ ds.danger)
  'Inactive':      { bg: 'bg-[#fee2e2]', text: 'text-[#7f1d1d]', dot: 'bg-[#ef4444]' },
  'Missing':       { bg: 'bg-[#fee2e2]', text: 'text-[#7f1d1d]' },
  'Non-Compliant': { bg: 'bg-[#fee2e2]', text: 'text-[#7f1d1d]', dot: 'bg-[#ef4444]' },
  'Failed':        { bg: 'bg-[#fee2e2]', text: 'text-[#7f1d1d]', dot: 'bg-[#ef4444]' },
  'Rejected':      { bg: 'bg-[#fee2e2]', text: 'text-[#7f1d1d]', dot: 'bg-[#ef4444]' },
  'Bounced':       { bg: 'bg-[#fee2e2]', text: 'text-[#7f1d1d]' },

  // ── Gray/Neutral states (→ ds.neutral)
  'Draft':    { bg: 'bg-[#f1f5f9]', text: 'text-[#475569]', dot: 'bg-[#94a3b8]' },
  'Archived': { bg: 'bg-[#f1f5f9]', text: 'text-[#475569]', dot: 'bg-[#94a3b8]' },

  // ── Blue states (→ ds.info)
  'Approved': { bg: 'bg-[#dbeafe]', text: 'text-[#1e3a8a]', dot: 'bg-[#3b82f6]' },
}

// Fallback for unknown status values
const STATUS_FALLBACK = { bg: 'bg-[#f1f5f9]', text: 'text-[#475569]' }

export interface StatusBadgeProps {
  status: string
  /** Show a colored dot before the label */
  withDot?: boolean
  className?: string
}

export function StatusBadge({ status, withDot = false, className }: StatusBadgeProps) {
  const style = STATUS_MAP[status] ?? STATUS_FALLBACK

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        'px-2 py-0.5 rounded',
        'text-ds-label font-bold whitespace-nowrap',
        style.bg,
        style.text,
        className
      )}
    >
      {withDot && style.dot && (
        <span className={cn('size-1.5 rounded-full shrink-0', style.dot)} />
      )}
      {status}
    </span>
  )
}

// =============================================================================
// SeverityBadge — alert / risk level indicator
// Replaces 7+ inline conditional class strings for severity.
//
// Usage:
//   <SeverityBadge level="High" />
//   <SeverityBadge level="Medium" />
//   <SeverityBadge level="Low" />
//   <SeverityBadge level="Critical" />
// =============================================================================

const SEVERITY_MAP: Record<string, { bg: string; text: string }> = {
  'Critical': { bg: 'bg-[#fee2e2]', text: 'text-[#7f1d1d]' },
  'High':     { bg: 'bg-[#fee2e2]', text: 'text-red-600' },
  'Medium':   { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]' },
  'Low':      { bg: 'bg-[#dbeafe]', text: 'text-[#1e3a8a]' },
  'Info':     { bg: 'bg-[#dbeafe]', text: 'text-[#1e3a8a]' },
}

const SEVERITY_FALLBACK = { bg: 'bg-[#f1f5f9]', text: 'text-[#475569]' }

export interface SeverityBadgeProps {
  level: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info' | string
  uppercase?: boolean
  className?: string
}

export function SeverityBadge({ level, uppercase = true, className }: SeverityBadgeProps) {
  const style = SEVERITY_MAP[level] ?? SEVERITY_FALLBACK

  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 rounded',
        'text-ds-micro font-bold leading-none tracking-widest',
        uppercase && 'uppercase',
        style.bg,
        style.text,
        className
      )}
    >
      {level}
    </span>
  )
}
