import { useEffect, useState } from 'react'
import { Search, Download, X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { LeadFilters, LeadStatus, LeadSource } from '@/types'

interface LeadFiltersProps {
  filters: LeadFilters
  onChange: (partial: Partial<LeadFilters>) => void
  onExport: () => void
  onClear: () => void
}

export default function LeadFilters({
  filters,
  onChange,
  onExport,
  onClear,
}: LeadFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search ?? '')
  const debouncedSearch = useDebounce(localSearch, 400)

  const hasActiveFilters = !!(
    filters.status ||
    filters.source ||
    filters.search ||
    filters.sort !== 'latest'
  )

  useEffect(() => {
    onChange({ search: debouncedSearch })
  }, [debouncedSearch])

  const handleClear = () => {
    setLocalSearch('')
    onClear()
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-3 shadow-sm">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search leads..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-9 h-9 bg-background/50"
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Select
          value={filters.status ?? ''}
          onValueChange={(val) =>
            onChange({ status: val === 'All' ? '' : (val as LeadStatus) })
          }
        >
          <SelectTrigger className="w-[145px] h-9 bg-background/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Contacted">Contacted</SelectItem>
            <SelectItem value="Qualified">Qualified</SelectItem>
            <SelectItem value="Lost">Lost</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.source ?? ''}
          onValueChange={(val) =>
            onChange({ source: val === 'All' ? '' : (val as LeadSource) })
          }
        >
          <SelectTrigger className="w-[145px] h-9 bg-background/50">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Sources</SelectItem>
            <SelectItem value="Website">Website</SelectItem>
            <SelectItem value="Instagram">Instagram</SelectItem>
            <SelectItem value="Referral">Referral</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.sort ?? 'latest'}
          onValueChange={(val: 'latest' | 'oldest') =>
            onChange({ sort: val })
          }
        >
          <SelectTrigger className="w-[150px] h-9 bg-background/50">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClear} className="h-9 gap-1.5 text-muted-foreground hover:text-foreground">
            <X className="size-3.5" />
            Clear
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onExport} className="h-9 gap-1.5">
          <Download className="size-3.5" />
          Export
        </Button>
      </div>
    </div>
  )
}