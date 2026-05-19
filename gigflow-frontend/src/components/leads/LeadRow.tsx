import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  TableCell,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/utils/formatDate'
import type { Lead } from '@/types'

interface LeadRowProps {
  lead: Lead
  onEdit: (lead: Lead) => void
  onDelete: (id: string) => void
  onView: (lead: Lead) => void
  canDelete: boolean
}

const statusColorMap: Record<Lead['status'], string> = {
  New: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60',
  Contacted: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
  Qualified: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
  Lost: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60',
}

const sourceIconMap: Record<Lead['source'], string> = {
  Website: '🌐',
  Instagram: '📸',
  Referral: '🤝',
}

export default function LeadRow({
  lead,
  onEdit,
  onDelete,
  onView,
  canDelete,
}: LeadRowProps) {
  return (
    <TableRow className="group cursor-default transition-colors">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-8 rounded-full bg-gradient-to-br from-indigo-500/10 to-blue-500/10 text-indigo-600 dark:text-indigo-300 text-xs font-bold shrink-0">
            {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-medium">{lead.name}</div>
            <div className="text-sm text-muted-foreground">{lead.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={statusColorMap[lead.status]}>
          {lead.status}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="text-sm">{sourceIconMap[lead.source]} {lead.source}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">{formatDate(lead.createdAt)}</span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={() => onView(lead)} title="View">
            <Eye className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={() => onEdit(lead)} title="Edit">
            <Pencil className="size-4" />
          </Button>
          {canDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full text-destructive/70 hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(lead._id)}
              title="Delete"
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}