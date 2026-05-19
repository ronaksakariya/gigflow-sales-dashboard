import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { useLeads } from "@/hooks/useLeads"
import { deleteLead, exportLeads } from "@/api/leads.api"
import Navbar from "@/components/layout/Navbar"
import LeadTable from "@/components/leads/LeadTable"
import LeadFilters from "@/components/leads/LeadFilters"
import LeadForm from "@/components/leads/LeadForm"
import LeadDetailModal from "@/components/leads/LeadDetailModal"
import Pagination from "@/components/common/Pagination"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { Lead } from "@/types"

export default function DashboardPage() {
  const { user } = useAuth()
  const {
    leads,
    meta,
    isLoading,
    error,
    filters,
    setFilters,
    handlePageChange,
    refetch,
  } = useLeads()

  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [viewingLead, setViewingLead] = useState<Lead | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const canDelete = user?.role === "admin"

  const handleAdd = () => {
    setEditingLead(null)
    setIsFormOpen(true)
  }

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await deleteLead(id)
        toast.success("Lead deleted successfully")
        refetch()
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to delete lead"
        toast.error(message)
      }
    }
  }

  const handleView = (lead: Lead) => {
    setViewingLead(lead)
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    setEditingLead(null)
    refetch()
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setEditingLead(null)
  }

  const handleExport = async () => {
    try {
      await exportLeads({
        status: filters.status,
        source: filters.source,
        search: filters.search,
        sort: filters.sort,
      })
      toast.success("Leads exported successfully")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to export leads"
      toast.error(message)
    }
  }

  const handleClearFilters = () => {
    setFilters({ status: '', source: '', search: '', sort: 'latest', page: 1 })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage and track your sales pipeline
            </p>
          </div>
          <Button
            onClick={handleAdd}
            size="lg"
            className="shadow-lg shadow-primary/20"
          >
            <Plus className="size-4" />
            Add Lead
          </Button>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mb-6">
          <LeadFilters
            filters={filters}
            onChange={setFilters}
            onExport={handleExport}
            onClear={handleClearFilters}
          />
        </div>

        <LeadTable
          leads={leads}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          canDelete={canDelete}
          onAdd={handleAdd}
        />

        {meta && meta.totalPages > 1 && (
          <Pagination meta={meta} onPageChange={handlePageChange} />
        )}

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="border-0 ring-0 sm:max-w-lg">
            <LeadForm
              lead={editingLead ?? undefined}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </DialogContent>
        </Dialog>

        <LeadDetailModal
          lead={viewingLead}
          isOpen={viewingLead !== null}
          onClose={() => setViewingLead(null)}
        />
      </main>
    </div>
  )
}
