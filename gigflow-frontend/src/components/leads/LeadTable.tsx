import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import EmptyState from '@/components/common/EmptyState'
import LeadRow from '@/components/leads/LeadRow'
import type { Lead } from '@/types'

interface LeadTableProps {
  leads: Lead[]
  isLoading: boolean
  onEdit: (lead: Lead) => void
  onDelete: (id: string) => void
  onView: (lead: Lead) => void
  canDelete: boolean
  onAdd?: () => void
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-[140px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[80px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[80px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[100px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[100px]" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default function LeadTable({
  leads,
  isLoading,
  onEdit,
  onDelete,
  onView,
  canDelete,
  onAdd,
}: LeadTableProps) {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold uppercase text-xs tracking-wider text-muted-foreground">Name / Email</TableHead>
              <TableHead className="font-semibold uppercase text-xs tracking-wider text-muted-foreground">Status</TableHead>
              <TableHead className="font-semibold uppercase text-xs tracking-wider text-muted-foreground">Source</TableHead>
              <TableHead className="font-semibold uppercase text-xs tracking-wider text-muted-foreground">Created</TableHead>
              <TableHead className="font-semibold uppercase text-xs tracking-wider text-muted-foreground w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <EmptyState
                    title="No leads found"
                    description="Try adjusting your filters or add a new lead."
                    action={onAdd ? { label: 'Add Lead', onClick: onAdd } : undefined}
                  />
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <LeadRow
                  key={lead._id}
                  lead={lead}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                  canDelete={canDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}