import type { ReactNode } from 'react'

/** Constrains page content to a comfortable reading width on desktop while
 * leaving the mobile column full-bleed. */
export default function PageContainer({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`md:mx-auto md:max-w-6xl md:px-6 ${className}`}>{children}</div>
  )
}
