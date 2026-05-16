/* eslint-disable react-refresh/only-export-components -- shadcn: export variants with components */
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utils/cn'

/** Snappy press-in; hover uses longer overshoot easing (“bubbly”). */
const btnEaseBouncy = 'ease-[cubic-bezier(0.34,1.45,0.48,1.08)]'
const btnDurHover = 'duration-[420ms]'

/**
 * iOS-style "liquid glass" — theme-aware; light mode stays more opaque for legibility.
 */
const glassBase = [
  `backdrop-blur-md border transition-[transform,background-color,box-shadow] ${btnDurHover} ${btnEaseBouncy} motion-reduce:duration-200 motion-reduce:ease-out`,
  'border-black/14 bg-black/[0.14] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_0_rgba(0,0,0,0.10)]',
  'dark:border-white/20 dark:bg-white/20 dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.48),inset_0_-1px_0_rgba(0,0,0,0.16)]',
  'hover:scale-[1.02] hover:bg-black/[0.20] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(0,0,0,0.06),0_4px_24px_-6px_rgba(0,0,0,0.10)]',
  'dark:hover:bg-white/[0.30] dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.62),inset_0_-1px_0_rgba(0,0,0,0.1),0_4px_24px_-6px_rgba(255,255,255,0.12)]',
  'active:scale-[0.99] active:duration-[180ms] active:ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:active:duration-150',
].join(' ')

/** ── Accent (Get in touch / Hire me): light = solid magenta gradient · dark = glossy liquid ── */
const accentVariant = [
  `transition-[transform,box-shadow,background-color] ${btnDurHover} ${btnEaseBouncy} motion-reduce:duration-200 motion-reduce:ease-out`,
  // Light — opaque solid CTA (purple → pink; shadows from --cta-* in index.css light)
  'border border-white/35 text-primary-foreground shadow-[var(--cta-rest-shadow)] focus-visible:!ring-white/55',
  'bg-gradient-to-br from-[var(--cta-main-from)] via-[var(--cta-main-via)] to-[var(--cta-main-to)]',
  'hover:scale-[1.03] hover:shadow-[var(--cta-hover-shadow)]',
  'active:scale-[0.99] active:duration-[180ms] active:ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:active:duration-150',
  // Dark — glossy accent (purple + frosted white; shadows purple-only via .dark vars)
  'dark:backdrop-blur-md dark:border-primary/50 dark:text-white dark:focus-visible:!ring-primary/55',
  'dark:bg-gradient-to-br dark:from-white/[0.28] dark:via-primary/30 dark:to-primary/[0.45]',
  'dark:hover:scale-[1.03] dark:hover:from-white/[0.38] dark:hover:via-primary/38 dark:hover:to-primary/55',
].join(' ')

/** Exported — light accent solid shell (inherits theme --cta-* shadows) */
export const ctaSolidMainSurface = [
  `border border-white/35 text-primary-foreground shadow-[var(--cta-rest-shadow)] transition-[transform,box-shadow] ${btnDurHover} ${btnEaseBouncy} motion-reduce:duration-200 focus-visible:!ring-white/55`,
  'bg-gradient-to-br from-[var(--cta-main-from)] via-[var(--cta-main-via)] to-[var(--cta-main-to)]',
  'hover:scale-[1.03] hover:shadow-[var(--cta-hover-shadow)]',
  'active:scale-[0.99] active:duration-[180ms] active:ease-[cubic-bezier(0.25,1,0.5,1)]',
].join(' ')

/** View Work + cursor: light = purple-tint glass · dark = neutral frosted glass (old secondary) */
const viewWorkNeutralDarkGlass = [
  'dark:border-white/20 dark:[background-image:none] dark:bg-white/20 dark:text-white',
  'dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.48),inset_0_-1px_0_rgba(0,0,0,0.16)]',
  'dark:hover:bg-white/[0.30] dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.62),inset_0_-1px_0_rgba(0,0,0,0.1),0_4px_24px_-6px_rgba(255,255,255,0.12)]',
].join(' ')

export const ctaLiquidGlassBase = [
  `backdrop-blur-md border text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.52),inset_0_-1px_0_rgba(124,79,226,0.12),0_0_24px_-10px_rgb(124_79_226/25%)] transition-[transform,background-color,box-shadow] ${btnDurHover} ${btnEaseBouncy} motion-reduce:duration-200 focus-visible:!ring-primary/55`,
  'border-primary/40 bg-gradient-to-br from-primary/22 via-primary/12 to-primary/28',
  viewWorkNeutralDarkGlass,
].join(' ')

const ctaLiquidGlassHoverInteractive = [
  'hover:scale-[1.025] active:scale-[0.99] motion-reduce:hover:scale-100',
  'active:duration-[180ms] active:ease-[cubic-bezier(0.25,1,0.5,1)]',
  'hover:from-primary/30 hover:via-primary/18 hover:to-primary/36 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.62),0_12px_40px_-10px_rgb(124_79_226/38%)]',
  'dark:hover:scale-[1.02] dark:hover:bg-white/[0.30]',
  'dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.62),inset_0_-1px_0_rgba(0,0,0,0.1),0_4px_24px_-6px_rgba(255,255,255,0.12)]',
].join(' ')

export const ctaLiquidGlassGroupHover = [
  'group-hover:scale-[1.025]',
  'group-hover:from-primary/30 group-hover:via-primary/18 group-hover:to-primary/36 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.62),0_12px_40px_-10px_rgb(124_79_226/38%)]',
  'dark:group-hover:scale-[1.02] dark:group-hover:bg-white/[0.30] dark:group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.62),inset_0_-1px_0_rgba(0,0,0,0.1),0_4px_24px_-6px_rgba(255,255,255,0.12)]',
].join(' ')

export const ctaLiquidGlassSurface = `${ctaLiquidGlassBase} ${ctaLiquidGlassHoverInteractive}`

/** View Work cursor pill (portaled): ring uses --brand-text-gradient; inner frost so border reads as gradient */
export const viewWorkCursorGradientRing = [
  'inline-flex rounded-full p-px [background:var(--brand-text-gradient)]',
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.48),0_8px_30px_-14px_rgb(124_79_226/36%)]',
  'dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_34px_-12px_rgb(167_139_250/28%)]',
  `transition-[transform,box-shadow] ${btnDurHover} ${btnEaseBouncy} motion-reduce:duration-200`,
].join(' ')

export const viewWorkCursorGradientRingEmphasis = [
  'scale-[1.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.58),0_14px_44px_-12px_rgb(124_79_226/45%)]',
  'dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_14px_44px_-12px_rgb(167_139_250/38%)]',
].join(' ')

export const viewWorkCursorFrostInset = [
  'relative z-[1] flex min-w-0 items-center gap-1.5 rounded-full px-4 py-2',
  'bg-white/[0.82] backdrop-blur-md',
  'dark:bg-zinc-950/[0.78]',
].join(' ')

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background/90 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: glassBase,
        accent: accentVariant,
        accentSecondary: ctaLiquidGlassSurface,
        destructive:
          `backdrop-blur-md border border-red-400/35 bg-red-500/25 text-red-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(0,0,0,0.2)] transition-[transform,background-color,box-shadow] ${btnDurHover} ${btnEaseBouncy} motion-reduce:duration-200 hover:scale-[1.02] hover:bg-red-500/40 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.48),inset_0_-1px_0_rgba(0,0,0,0.12)] active:scale-[0.99] active:duration-[180ms] active:ease-[cubic-bezier(0.25,1,0.5,1)]`,
        outline: glassBase,
        secondary: ctaLiquidGlassSurface,
        ghost: [
          `backdrop-blur-md border transition-[transform,background-color,box-shadow] ${btnDurHover} ${btnEaseBouncy} motion-reduce:duration-200`,
          'border-black/12 bg-black/[0.10] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_0_rgba(0,0,0,0.08)]',
          'dark:border-white/15 dark:bg-white/[0.12] dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.38),inset_0_-1px_0_rgba(0,0,0,0.14)]',
          'hover:scale-[1.02] hover:bg-black/[0.16] hover:border-black/14',
          'dark:hover:bg-white/[0.22] dark:hover:border-white/25 dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.52),inset_0_-1px_0_rgba(0,0,0,0.1)]',
          'active:scale-[0.99] active:duration-[180ms] active:ease-[cubic-bezier(0.25,1,0.5,1)]',
        ].join(' '),
        link:
          'rounded-md border-0 bg-transparent px-0 text-primary underline-offset-4 shadow-none backdrop-blur-none transition-colors hover:scale-100 hover:bg-transparent hover:text-primary/90 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-lg px-3 text-sm',
        lg: 'h-11 rounded-xl px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
