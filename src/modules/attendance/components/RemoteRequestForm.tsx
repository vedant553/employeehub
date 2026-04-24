"use client"
import * as React from 'react'
import { FormField, FormFieldInput, Input, Textarea, Button, DrawerWrapper } from '@hryantra/ui'
import { useStore } from '@/store/StoreProvider'

interface RemoteRequestFormProps {
  open: boolean
  onClose: () => void
}

export function RemoteRequestForm({ open, onClose }: RemoteRequestFormProps) {
  const { submitRemoteRequest } = useStore()
  
  const [date, setDate] = React.useState('')
  const [location, setLocation] = React.useState('')
  const [purpose, setPurpose] = React.useState('')

  const handleSave = () => {
    if (!date || !location || !purpose) return // Basic validation
    
    submitRemoteRequest({
      date, location, purpose
    })
    
    setDate('')
    setLocation('')
    setPurpose('')
    onClose()
  }

  return (
    <DrawerWrapper
      open={open}
      onClose={onClose}
      title="Request Remote Work"
      subtitle="Submit a request for GPS-enabled remote attendance"
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} className="mr-auto">Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Submit Request</Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <FormField label="Date" required>
          <FormFieldInput>
            <Input type="date" value={date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)} />
          </FormFieldInput>
        </FormField>
        
        <FormField label="Location" required>
          <FormFieldInput>
            <Input placeholder="e.g. Home Office, Acme Client Site" value={location} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)} />
          </FormFieldInput>
        </FormField>

        <FormField label="Purpose" required>
          <FormFieldInput>
            <Textarea placeholder="Explain business reason..." rows={3} value={purpose} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPurpose(e.target.value)} />
          </FormFieldInput>
        </FormField>
      </div>
    </DrawerWrapper>
  )
}
