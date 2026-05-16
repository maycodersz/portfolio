import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { portfolio, type AutomationProject } from '@/content/portfolio'

type AutomationModalProps = {
  project: AutomationProject | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AutomationModal({ project, open, onOpenChange }: AutomationModalProps) {
  const copy = portfolio.automationModal

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{project?.title ?? copy.fallbackTitle}</DialogTitle>
        </DialogHeader>
        <div className="flex min-h-[240px] flex-col items-center justify-center gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-foreground/75">
            {copy.eyebrow}
          </p>
          <p className="text-muted-foreground" role="status">
            {copy.pendingBody}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
