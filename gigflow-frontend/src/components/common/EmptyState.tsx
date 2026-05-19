import { Inbox, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex items-center justify-center size-16 rounded-2xl bg-muted/70 mb-5">
        <Inbox className="size-8 text-muted-foreground/60" />
      </div>
      <p className="text-lg font-semibold text-foreground">{title}</p>
      <p className="mt-1.5 text-sm text-muted-foreground max-w-sm text-center leading-relaxed">{description}</p>
      {action && (
        <Button className="mt-6 shadow-lg shadow-primary/20" onClick={action.onClick}>
          <Plus className="size-4 mr-1" />
          {action.label}
        </Button>
      )}
    </div>
  )
}