import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatDateTime } from "@/utils/formatDate"
import type { Lead } from "@/types"

interface LeadDetailModalProps {
  lead: Lead | null
  isOpen: boolean
  onClose: () => void
}

export default function LeadDetailModal({
  lead,
  isOpen,
  onClose,
}: LeadDetailModalProps) {
  if (!lead) return null

  const creatorName =
    typeof lead.createdBy === "object" ? lead.createdBy.name : lead.createdBy

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 ring-0">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="flex size-10 items-center justify-center rounded-full bg-linear-to-br from-indigo-500/10 to-blue-500/10 text-sm font-bold text-indigo-600 dark:text-indigo-300">
              {lead.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span>{lead.name}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {lead.email}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50">
            <span className="text-sm font-medium text-muted-foreground">
              Status
            </span>
            <Badge
              variant="outline"
              className={
                lead.status === "New"
                  ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-300"
                  : lead.status === "Contacted"
                    ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300"
                    : lead.status === "Qualified"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "border-red-200 bg-red-50 text-red-700 dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-300"
              }
            >
              {lead.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50">
            <span className="text-sm font-medium text-muted-foreground">
              Source
            </span>
            <span className="text-sm font-medium">{lead.source}</span>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50">
            <span className="text-sm font-medium text-muted-foreground">
              Created
            </span>
            <span className="text-sm">{formatDateTime(lead.createdAt)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50">
            <span className="text-sm font-medium text-muted-foreground">
              Updated
            </span>
            <span className="text-sm">{formatDateTime(lead.updatedAt)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50">
            <span className="text-sm font-medium text-muted-foreground">
              Created By
            </span>
            <span className="text-sm font-medium">{creatorName}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
