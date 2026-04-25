"use client"

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils'
import { Spinner } from './Spinner'

// =============================================================================
// Button — primary interactive element
// CHANGES vs v1:
//   - Removed `asChild` prop (was declared but never implemented — silent bug)
//   - All hex colors replaced with ds-* token classes
//   - data-active cast to 'true' | undefined to fix Tailwind data-attribute matching
//   - Loading layout: spinner replaces icon slot, text stays visible (no layout jump)
// =============================================================================

const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2',
    'rounded-lg border border-transparent',
    'text-ds-body font-bold whitespace-nowrap',
    'transition-all duration-150 cursor-pointer',
    'outline-none select-none',
    // Focus ring — uses token class
    'focus-visible:ring-3 focus-visible:ring-ds-brand-green/30 focus-visible:border-ds-brand-green',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98]',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        // Primary — green filled
        default:
          'bg-ds-brand-green text-white hover:bg-ds-brand-green-dark border-ds-brand-green hover:border-ds-brand-green-dark shadow-sm',

        // Outline — cancel / back
        outline:
          'bg-white text-ds-neutral-900 border-ds-neutral-200 hover:bg-ds-neutral-50 hover:border-ds-neutral-300',

        // Secondary — navy filled
        secondary:
          'bg-ds-brand-navy text-white hover:bg-ds-brand-navy-light border-ds-brand-navy shadow-sm',

        // Ghost — text-only
        ghost:
          'text-ds-neutral-500 hover:text-ds-neutral-900 hover:bg-ds-neutral-100 border-transparent',

        // Destructive — red filled
        destructive:
          'bg-ds-danger text-white hover:bg-ds-danger-dark border-ds-danger hover:border-ds-danger-dark shadow-sm',

        // Destructive Outline — milder destructive (reject, archive)
        'destructive-outline':
          'bg-white text-ds-danger border-ds-neutral-200 hover:bg-ds-danger-light hover:border-ds-danger-border',

        // Toggle — format pickers (xlsx/csv/pdf)
        // FIX: data-active must be the string "true", not boolean
        toggle:
          'bg-white text-ds-neutral-500 border-ds-neutral-200 hover:bg-ds-neutral-50 data-[active=true]:bg-ds-brand-green-light data-[active=true]:text-ds-brand-green data-[active=true]:border-ds-brand-green/30',

        // Link — text-only anchor style
        link:
          'text-ds-brand-green hover:text-ds-brand-green-dark border-transparent underline-offset-4 hover:underline',
      },
      size: {
        md:       'h-10 px-5',
        sm:       'h-8 px-4 text-ds-body-sm',
        xs:       'h-7 px-3 rounded-md text-ds-label',
        lg:       'h-11 px-6 text-ds-heading-sm',
        icon:     'size-9 rounded-lg',
        'icon-sm':'size-8 rounded-lg',
        'icon-xs':'size-7 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  /**
   * For toggle variant — pass true/false, component handles data-attribute casting.
   */
  active?: boolean
  // NOTE: asChild has been intentionally removed.
  // Reason: it was declared but never implemented, causing a silent type-safe lie.
  // Use className + a wrapper <Link> for navigation buttons instead.
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      loading = false,
      active,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    // Spinner color: filled variants get white spinner; outlined/ghost get brand
    const spinnerColor: 'white' | 'brand' =
      variant === 'outline' ||
      variant === 'ghost' ||
      variant === 'toggle' ||
      variant === 'destructive-outline' ||
      variant === 'link'
        ? 'brand'
        : 'white'

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        suppressHydrationWarning
        // FIX: cast boolean to string "true" | undefined so Tailwind data-[active=true] matches
        data-active={active === true ? 'true' : undefined}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {loading ? (
          // FIX: spinner replaces leading icon slot; text stays visible.
          // Width is preserved — no layout jump.
          <>
            <Spinner size="sm" color={spinnerColor} aria-hidden="true" />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { buttonVariants }
