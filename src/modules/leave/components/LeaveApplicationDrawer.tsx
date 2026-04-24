"use client"
import * as React from 'react'
import { DrawerWrapper, FormField, FormFieldInput, Input, Select, Textarea, Button, FormGrid } from '@hryantra/ui'
import { useStore } from '@/store/StoreProvider'
import { LeaveType } from '../types'

interface LeaveApplicationDrawerProps {
  open: boolean
  onClose: () => void
}

export function LeaveApplicationDrawer({ open, onClose }: LeaveApplicationDrawerProps) {
  const { applyForLeave } = useStore()
  
  const [type, setType] = React.useState<LeaveType | ''>('')
  const [startDate, setStartDate] = React.useState('')
  const [endDate, setEndDate] = React.useState('')
  const [reason, setReason] = React.useState('')

  const handleSave = () => {
    if (!type || !startDate || !endDate || !reason) return
    
    // Quick diff calculation for totalDays
    const d1 = new Date(startDate)
    const d2 = new Date(endDate)
    const diffTime = Math.abs(d2.getTime() - d1.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    applyForLeave({
      type: type as LeaveType,
      startDate,
      endDate,
      totalDays: diffDays,
      reason
    })
    
    // Reset and close
    setType('')
    setStartDate('')
    setEndDate('')
    setReason('')
    onClose()
  }

  return (
    <DrawerWrapper
      open={open}
      onClose={onClose}
      title="Apply for Leave"
      subtitle="Submit your time off request for approval"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} className="mr-auto">Cancel</Button>
          <Button variant="default" onClick={handleSave}>Submit Request</Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <FormField label="Leave Type" required>
          <FormFieldInput>
            <Select value={type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value as LeaveType)}>
              <option value="">Select Type</option>
              <option value="Casual">Casual Leave (CL)</option>
              <option value="Sick">Sick Leave (SL)</option>
              <option value="Earned">Earned Leave (EL)</option>
              <option value="Unpaid">Unpaid Leave</option>
              <option value="Compensatory">Compensatory Off</option>
            </Select>
          </FormFieldInput>
        </FormField>
        
        <FormGrid cols={2}>
          <FormField label="Start Date" required>
            <FormFieldInput>
              <Input type="date" value={startDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)} />
            </FormFieldInput>
          </FormField>
          <FormField label="End Date" required>
            <FormFieldInput>
              <Input type="date" value={endDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)} />
            </FormFieldInput>
          </FormField>
        </FormGrid>

        <FormField label="Reason" required>
          <FormFieldInput>
            <Textarea placeholder="Please provide details..." rows={4} value={reason} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)} />
          </FormFieldInput>
        </FormField>

        {/* Attachment mocked UI */}
        <div className="flex flex-col gap-2">
            <span className="text-ds-label text-ds-neutral-900 font-medium font-semibold">Attachments (Optional)</span>
            <div className="border border-dashed border-ds-neutral-300 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-ds-neutral-50/50 cursor-pointer hover:bg-ds-neutral-50">
               <span className="text-ds-body-sm text-ds-brand-navy font-medium">Click to upload</span>
               <span className="text-ds-caption text-ds-neutral-500 mt-1">Medical certificates or other supporting documents</span>
            </div>
        </div>
      </div>
    </DrawerWrapper>
  )
}
