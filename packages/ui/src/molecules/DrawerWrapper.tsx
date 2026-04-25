"use client"

import * as React from 'react'
import { X } from 'lucide-react'
import { Button } from '../atoms/Button'
import { cn } from '../utils'
import { lockScroll, unlockScroll } from '../utils/scroll-lock'

// =============================================================================
// DrawerWrapper — right-side slide panel
//
// CHANGES vs v1:
//   - CRITICAL FIX: Removed `if (!open) return null` that killed exit animation.
//     Now uses a `mounted` state — component stays in DOM during close transition.
//     CSS transition plays on both open and close.
//   - Scroll lock now uses SHARED counter from utils/scroll-lock.ts — safe stacking.
//   - Replaced bg-gray-50/gray-200 with ds-* token classes.
//   - headerExtra pb-0 removed — lets headerExtra content control its own spacing.
//   - Added role="dialog" aria-modal="true" aria-labelledby.
// =============================================================================

// ─── Size Map ─────────────────────────────────────────────────────────────────

const SIZE_MAP = {
  sm:   'max-w-[450px]',
  md:   'max-w-[600px]',
  lg:   'max-w-[800px]',
  full: 'max-w-[960px]',
} as const

// ─── Props ────────────────────────────────────────────────────────────────────

export interface DrawerWrapperProps {
  open: boolean
  onClose: () => void
  title: React.ReactNode
  subtitle?: React.ReactNode
  size?: keyof typeof SIZE_MAP
  /** Rendered below the title row — TabsNav, AlertBanner, etc. */
  headerExtra?: React.ReactNode
  /** Footer bar pinned at bottom — action buttons */
  footer?: React.ReactNode
  /** Right side of header row — edit button, overflow menu */
  headerActions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

const TRANSITION_DURATION = 300 // ms — must match CSS duration below

export function DrawerWrapper({
  open,
  onClose,
  title,
  subtitle,
  size = 'md',
  headerExtra,
  footer,
  headerActions,
  children,
  className,
}: DrawerWrapperProps) {
  const titleId = React.useId()

  // FIX: Keep component mounted during close animation.
  // `mounted` tracks whether DOM elements should exist.
  // `visible` drives the CSS translate (true = translate-x-0, false = translate-x-full)
  const [mounted, setMounted] = React.useState(false)
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setMounted(true)
      // Small rAF delay so browser registers the initial translate-x-full
      // before we set translate-x-0, otherwise the transition won't play.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
    } else {
      // Trigger close animation, then unmount after transition completes
      setVisible(false)
      const timer = setTimeout(() => setMounted(false), TRANSITION_DURATION)
      return () => clearTimeout(timer)
    }
  }, [open])

  // Escape key
  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Scroll lock — shared counter
  React.useEffect(() => {
    if (open) {
      lockScroll()
      return () => unlockScroll()
    }
  }, [open])

  if (!mounted) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 backdrop-blur-sm transition-opacity',
          'bg-ds-brand-navy/40',
          visible ? 'opacity-100' : 'opacity-0'
        )}
        style={{ transitionDuration: `${TRANSITION_DURATION}ms` }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex flex-col w-full',
          'bg-ds-neutral-50 shadow-2xl',
          'transform transition-transform ease-in-out',
          visible ? 'translate-x-0' : 'translate-x-full',
          SIZE_MAP[size],
          className
        )}
        style={{ transitionDuration: `${TRANSITION_DURATION}ms` }}
      >
        {/* Sticky Header */}
        <div className="bg-white border-b border-ds-neutral-200 shrink-0">
          <div className="flex items-start justify-between p-6 pb-4">
            <div className="flex-1 min-w-0">
              <h2
                id={titleId}
                className="text-ds-heading font-bold text-ds-neutral-900 leading-tight pr-4"
              >
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1 text-ds-body-sm text-ds-neutral-500">{subtitle}</p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {headerActions}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onClose}
                aria-label="Close panel"
                className="text-ds-neutral-400 ml-1"
              >
                <X className="size-5" />
              </Button>
            </div>
          </div>

          {/* Header Extra — FIX: removed pb-0 override, let content control its own spacing */}
          {headerExtra && (
            <div className="px-6">
              {headerExtra}
            </div>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-ds-neutral-50">
          {children}
        </div>

        {/* Sticky Footer */}
        {footer && (
          <div className="shrink-0 bg-ds-surface-page border-t border-ds-neutral-200 p-5 flex items-center gap-3">
            {footer}
          </div>
        )}
      </div>
    </>
  )
}
