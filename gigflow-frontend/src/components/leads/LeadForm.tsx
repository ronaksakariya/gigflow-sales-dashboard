import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createLead, updateLead } from '@/api/leads.api'
import type { Lead } from '@/types'

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
})

type LeadFormData = z.infer<typeof leadSchema>

interface LeadFormProps {
  lead?: Lead
  onSuccess: () => void
  onCancel: () => void
}

export default function LeadForm({ lead, onSuccess, onCancel }: LeadFormProps) {
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: lead
      ? {
          name: lead.name,
          email: lead.email,
          status: lead.status,
          source: lead.source,
        }
      : {
          status: 'New',
          source: 'Website',
        },
  })

  const onSubmit = async (data: LeadFormData) => {
    setFormError(null)
    try {
      if (lead) {
        await updateLead(lead._id, data)
      } else {
        await createLead(data)
      }
      onSuccess()
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong'
      setFormError(message)
    }
  }

  const currentStatus = watch('status')
  const currentSource = watch('source')

  return (
    <Card className="border-0 shadow-none ring-0">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">{lead ? 'Edit Lead' : 'Add Lead'}</CardTitle>
        <CardDescription>
          {lead ? 'Update the lead information below.' : 'Fill in the details to create a new lead.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-medium">Full Name</Label>
            <Input id="name" {...register('name')} placeholder="John Doe" className="h-11 bg-background/50" />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-medium">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="john@example.com"
              className="h-11 bg-background/50"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-medium">Status</Label>
              <Select
                value={currentStatus}
                onValueChange={(val) =>
                  setValue('status', val as LeadFormData['status'], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="h-11 bg-background/50">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Qualified">Qualified</SelectItem>
                  <SelectItem value="Lost">Lost</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Source</Label>
              <Select
                value={currentSource}
                onValueChange={(val) =>
                  setValue('source', val as LeadFormData['source'], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="h-11 bg-background/50">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                </SelectContent>
              </Select>
              {errors.source && (
                <p className="text-sm text-destructive">
                  {errors.source.message}
                </p>
              )}
            </div>
          </div>

          {formError && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {formError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t">
            <Button type="button" variant="outline" onClick={onCancel} className="h-10">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="h-10 shadow-lg shadow-primary/20">
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {lead ? 'Update Lead' : 'Create Lead'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}