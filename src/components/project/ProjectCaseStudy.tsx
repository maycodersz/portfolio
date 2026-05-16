import { cn } from '@/utils/cn'

type ProjectCaseStudyProps = {
  title: string
  body: string
  className?: string
}

/** Static case-study block: gradient heading + muted body. */
export function ProjectCaseStudy({ title, body, className }: ProjectCaseStudyProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <h2 className="text-gradient-brand px-px py-px text-xl font-extrabold tracking-tight sm:text-2xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">{body}</p>
    </div>
  )
}

type ProjectCaseStudyPairProps = {
  left: { title: string; body: string }
  right: { title: string; body: string }
  className?: string
}

/** Problem (left) + Solution (right) side-by-side with a divider between. */
export function ProjectCaseStudyPair({ left, right, className }: ProjectCaseStudyPairProps) {
  return (
    <section
      className={cn('border-t border-border bg-background px-[10%] py-12 md:py-16', className)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:divide-x lg:divide-border lg:gap-0">
          <div className="min-w-0 lg:pr-12">
            <ProjectCaseStudy title={left.title} body={left.body} />
          </div>
          <div className="min-w-0 lg:pl-12">
            <ProjectCaseStudy title={right.title} body={right.body} />
          </div>
        </div>
      </div>
    </section>
  )
}

type ProjectCaseStudySingleProps = {
  title: string
  body: string
  className?: string
}

/** Full-width single case-study section (used for Results). */
export function ProjectCaseStudySingle({ title, body, className }: ProjectCaseStudySingleProps) {
  return (
    <section
      className={cn('border-t border-border bg-background px-[10%] py-12 md:py-16', className)}
    >
      <div className="mx-auto max-w-3xl">
        <ProjectCaseStudy title={title} body={body} />
      </div>
    </section>
  )
}
