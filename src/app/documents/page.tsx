"use client"
import * as React from 'react'
import { PageHeader, SectionCard, DataTable, Button, Input, StatusBadge, type ColumnDef, type SortDirection } from '@hryantra/ui'
import { useStore } from '@/store/StoreProvider'
import { Document, DocumentCategory } from '@/modules/documents/types'
import { Plus, Search, Filter, FileText, Download, MoreHorizontal, FileIcon, FileSpreadsheet, ImageIcon, MoreVertical } from 'lucide-react'
import { DocumentUploadDrawer } from '@/modules/documents/components/DocumentUploadDrawer'
import { DocumentDetailDrawer } from '@/modules/documents/components/DocumentDetailDrawer'

export default function DocumentsPage() {
  const { documents } = useStore()
  
  const [search, setSearch] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState<DocumentCategory | 'All'>('All')
  const [isUploadOpen, setIsUploadOpen] = React.useState(false)
  const [selectedDoc, setSelectedDoc] = React.useState<Document | null>(null)
  
  const [sortColumn, setSortColumn] = React.useState<string | undefined>('uploadedAt')
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc')
  const [page, setPage] = React.useState(1)

  const filteredDocuments = React.useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || 
                           doc.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
                           doc.id.toLowerCase().includes(search.toLowerCase())
      
      const matchesCategory = categoryFilter === 'All' || doc.category === categoryFilter
      
      return matchesSearch && matchesCategory
    })
  }, [documents, search, categoryFilter])

  const sortedDocuments = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredDocuments
    return [...filteredDocuments].sort((a, b) => {
      const aVal = String(a[sortColumn as keyof Document] || '')
      const bVal = String(b[sortColumn as keyof Document] || '')
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })
  }, [filteredDocuments, sortColumn, sortDirection])

  const getFileIcon = (type: string) => {
    if (type === 'PDF') return <FileText className="size-5 text-red-500" />
    if (type === 'Excel') return <FileSpreadsheet className="size-5 text-emerald-600" />
    if (type === 'Word') return <FileIcon className="size-5 text-blue-600" />
    if (type === 'Image') return <ImageIcon className="size-5 text-amber-500" />
    return <FileText className="size-5 text-ds-neutral-400" />
  }

  const columns: ColumnDef<Document>[] = [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Document Name',
      sortable: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-3 py-1">
          <div className="size-9 rounded-lg bg-ds-neutral-50 border border-ds-neutral-200 flex items-center justify-center">
            {getFileIcon(row.type)}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-ds-body-sm font-semibold truncate text-ds-brand-navy">{row.name}</span>
            <span className="text-[10px] text-ds-neutral-500 font-bold uppercase tracking-wider">{row.id} • {row.size}</span>
          </div>
        </div>
      )
    },
    {
      id: 'category',
      accessorKey: 'category',
      header: 'Type',
      sortable: true,
      cell: ({ row }) => (
        <div className="px-2 py-0.5 rounded-full bg-ds-neutral-100 text-[11px] font-bold text-ds-neutral-600 inline-block">
          {row.category}
        </div>
      )
    },
    {
      id: 'employeeName',
      accessorKey: 'employeeName',
      header: 'Employee',
      sortable: true,
      cell: ({ row }) => row.employeeName ? (
        <span className="text-ds-body-sm text-ds-brand-navy font-medium">{row.employeeName}</span>
      ) : (
        <span className="text-ds-caption text-ds-neutral-400 italic">General</span>
      )
    },
    {
      id: 'uploadedBy',
      accessorKey: 'uploadedBy',
      header: 'Uploaded By',
      className: 'text-ds-body-sm text-ds-neutral-600',
    },
    {
      id: 'uploadedAt',
      accessorKey: 'uploadedAt',
      header: 'Date',
      sortable: true,
      cell: ({ row }) => (
        <span className="text-ds-body-sm text-ds-neutral-500" suppressHydrationWarning>
          {new Date(row.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      )
    },
    {
      id: 'actions',
      header: '',
      width: 60,
      cell: ({ row }) => (
        <div className="flex justify-end pr-2">
          <Button variant="ghost" size="icon-sm" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setSelectedDoc(row) }}>
            <MoreVertical className="size-4 text-ds-neutral-400" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="flex flex-col h-full space-y-6 max-w-7xl mx-auto w-full p-6 overflow-y-auto">
      <PageHeader 
        title="Documents" 
        description="Centralized repository for employee, company, and compliance files."
        actions={
          <Button variant="primary" onClick={() => setIsUploadOpen(true)}>
            <Plus className="size-4 mr-2" /> Upload Document
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Files', value: documents.length, icon: FileText, color: 'text-ds-brand-navy' },
          { label: 'Employee Docs', value: documents.filter(d => d.category === 'Employee').length, icon: Plus, color: 'text-emerald-600' },
          { label: 'Company Policy', value: documents.filter(d => d.category === 'Company').length, icon: ShieldCheck, color: 'text-ds-info-dark' },
          { label: 'Archived', value: documents.filter(d => d.status === 'Archived').length, icon: Archive, color: 'text-ds-neutral-400' },
        ].map((stat, i) => (
          <SectionCard key={i} className="flex flex-col">
            <div className="flex items-center gap-3 text-ds-neutral-500 mb-2">
              <stat.icon className="size-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">{stat.label}</span>
            </div>
            <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
          </SectionCard>
        ))}
      </div>

      <SectionCard>
        {/* Filters Top Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ds-neutral-400" />
            <Input 
              placeholder="Search by name, employee, or ID..." 
              className="pl-10"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
            <span className="text-ds-body-sm font-semibold text-ds-brand-navy shrink-0">Category:</span>
            {['All', 'Employee', 'Company', 'Compliance', 'Asset Receipt'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat as any)}
                className={`px-3 py-1 rounded-full text-ds-body-xs font-medium transition-all whitespace-nowrap ${
                  categoryFilter === cat 
                    ? 'bg-ds-brand-navy text-white shadow-sm' 
                    : 'bg-ds-neutral-100 text-ds-neutral-500 hover:bg-ds-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <DataTable
          data={sortedDocuments}
          columns={columns}
          keyExtractor={(row) => row.id}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={(col, dir) => { setSortColumn(col); setSortDirection(dir) }}
          onRowClick={(row) => setSelectedDoc(row)}
          pagination={{
            page: page,
            perPage: 10,
            total: filteredDocuments.length,
            onPageChange: setPage,
            perPageOptions: [10, 20, 50]
          }}
        />
      </SectionCard>

      <DocumentUploadDrawer open={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
      <DocumentDetailDrawer 
        open={selectedDoc !== null} 
        onClose={() => setSelectedDoc(null)} 
        document={selectedDoc} 
      />
    </div>
  )
}

function ShieldCheck(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function Archive(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="5" x="2" y="3" rx="1" />
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
      <path d="M10 12h4" />
    </svg>
  )
}
