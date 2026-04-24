'use client'
import * as React from 'react'
import { PageHeader, SectionCard, Button } from '@hryantra/ui'
import { useStore } from '@/store/StoreProvider'
import { AssetType, AssetStatus, Asset } from '@/modules/assets/types'
import { AssetDetailDrawer } from '@/modules/assets/components/AssetDetailDrawer'
import { AssignAssetModal } from '@/modules/assets/components/AssignAssetModal'
import {
  Laptop, Monitor, Headphones, Smartphone, CreditCard,
  Keyboard, Package, FileText, Plus, Search, Filter,
  CheckCircle2, AlertTriangle, Wrench, Archive
} from 'lucide-react'

const ASSET_ICONS: Record<string, React.ElementType> = {
  'Laptop': Laptop, 'Monitor': Monitor, 'Headset': Headphones,
  'Mobile Phone': Smartphone, 'Access Card': CreditCard,
  'Keyboard & Mouse': Keyboard, 'Software License': FileText,
  'SIM Card': Smartphone, 'Other': Package,
}

const STATUS_CONFIG: Record<string, { icon: React.ElementType; pill: string }> = {
  'Available': { icon: CheckCircle2, pill: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  'Assigned':  { icon: Package,      pill: 'bg-blue-50 text-blue-700 border border-blue-200' },
  'In Repair': { icon: Wrench,       pill: 'bg-amber-50 text-amber-700 border border-amber-200' },
  'Retired':   { icon: Archive,      pill: 'bg-ds-neutral-100 text-ds-neutral-600 border border-ds-neutral-200' },
}

const CONDITION_PILL: Record<string, string> = {
  'New':     'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Good':    'bg-blue-50 text-blue-700 border border-blue-200',
  'Fair':    'bg-amber-50 text-amber-700 border border-amber-200',
  'Damaged': 'bg-red-50 text-red-700 border border-red-200',
}

export default function AssetsRegistryPage() {
  const { assets, assetAllocations, employees } = useStore()

  const [search, setSearch] = React.useState('')
  const [filterStatus, setFilterStatus] = React.useState<AssetStatus | 'All'>('All')
  const [filterType, setFilterType] = React.useState<AssetType | 'All'>('All')
  const [selectedAsset, setSelectedAsset] = React.useState<Asset | null>(null)
  const [assignTarget, setAssignTarget] = React.useState<Asset | null>(null)

  const assetTypes = Array.from(new Set(assets.map(a => a.type))) as AssetType[]

  const filtered = assets.filter(a => {
    const q = search.toLowerCase()
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.serialNumber.toLowerCase().includes(q) || a.brand.toLowerCase().includes(q)
    const matchStatus = filterStatus === 'All' || a.status === filterStatus
    const matchType = filterType === 'All' || a.type === filterType
    return matchSearch && matchStatus && matchType
  })

  // Summary counts
  const counts = {
    total: assets.length,
    available: assets.filter(a => a.status === 'Available').length,
    assigned: assets.filter(a => a.status === 'Assigned').length,
    repair: assets.filter(a => a.status === 'In Repair').length,
  }

  const getAssignedEmployee = (assetId: string) => {
    const alloc = assetAllocations.find(al => al.assetId === assetId && al.status === 'Active')
    if (!alloc) return null
    return employees.find(e => e.id === alloc.employeeId) ?? null
  }

  return (
    <div className="flex flex-col h-full space-y-6 max-w-7xl mx-auto w-full p-6 overflow-y-auto">
      <PageHeader
        title="Asset Registry"
        actions={
          <Button variant="default" className="flex items-center gap-2">
            <Plus className="size-4" /> Add Asset
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Assets',    value: counts.total,     icon: Package,      accent: 'text-ds-brand-navy',  bg: 'bg-white' },
          { label: 'Available',       value: counts.available, icon: CheckCircle2, accent: 'text-emerald-600',    bg: 'bg-emerald-50/60' },
          { label: 'Assigned',        value: counts.assigned,  icon: Laptop,       accent: 'text-blue-600',       bg: 'bg-blue-50/60' },
          { label: 'In Repair',       value: counts.repair,    icon: Wrench,       accent: 'text-amber-600',      bg: 'bg-amber-50/60' },
        ].map(({ label, value, icon: Icon, accent, bg }) => (
          <div key={label} className={`${bg} border border-ds-neutral-200 rounded-xl p-4 flex flex-col gap-2 shadow-sm`}>
            <div className={`flex items-center gap-2 text-ds-label font-semibold uppercase ${accent}`}>
              <Icon className="size-4" /> {label}
            </div>
            <span className={`text-3xl font-bold ${accent}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white border border-ds-neutral-200 rounded-xl p-4 shadow-sm">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ds-neutral-400 pointer-events-none" />
          <input
            className="w-full pl-9 pr-4 py-2 text-ds-body-sm border border-ds-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-ds-brand-green/20"
            placeholder="Search by name, serial, brand…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="size-4 text-ds-neutral-400" />
          <select
            className="text-ds-body-sm border border-ds-neutral-300 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-ds-brand-green/20"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as AssetStatus | 'All')}
          >
            <option value="All">All Statuses</option>
            {(['Available', 'Assigned', 'In Repair', 'Retired'] as AssetStatus[]).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            className="text-ds-body-sm border border-ds-neutral-300 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-ds-brand-green/20"
            value={filterType}
            onChange={e => setFilterType(e.target.value as AssetType | 'All')}
          >
            <option value="All">All Types</option>
            {assetTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Asset Table */}
      <SectionCard title={`Assets (${filtered.length})`} className="flex-1 min-h-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-ds-neutral-200">
                {['Asset', 'Type', 'Serial No.', 'Condition', 'Status', 'Assigned To', ''].map(h => (
                  <th key={h} className="py-3 px-3 text-ds-label uppercase text-ds-neutral-500 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(asset => {
                const IconComp = ASSET_ICONS[asset.type] ?? Package
                const sc = STATUS_CONFIG[asset.status]
                const StatusIcon = sc.icon
                const assignedEmp = getAssignedEmployee(asset.id)
                return (
                  <tr
                    key={asset.id}
                    className="border-b border-ds-neutral-100 hover:bg-ds-neutral-50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-ds-brand-navy flex items-center justify-center text-white shrink-0">
                          <IconComp className="size-4" />
                        </div>
                        <div>
                          <p className="text-ds-body-sm font-semibold text-ds-brand-navy">{asset.name}</p>
                          <p className="text-ds-caption text-ds-neutral-400">{asset.brand} · {asset.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-ds-body-sm text-ds-neutral-600 whitespace-nowrap">{asset.type}</td>
                    <td className="py-3 px-3">
                      <span className="text-ds-caption font-mono text-ds-neutral-600 bg-ds-neutral-100 px-2 py-0.5 rounded">{asset.serialNumber}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${CONDITION_PILL[asset.condition]}`}>
                        {asset.condition}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${sc.pill}`}>
                        <StatusIcon className="size-3" /> {asset.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {assignedEmp ? (
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded-full bg-ds-brand-navy/10 text-ds-brand-navy flex items-center justify-center text-[10px] font-bold shrink-0">
                            {assignedEmp.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-ds-body-sm text-ds-neutral-700 whitespace-nowrap">{assignedEmp.name}</span>
                        </div>
                      ) : (
                        <span className="text-ds-caption text-ds-neutral-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {asset.status === 'Available' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e: React.MouseEvent) => { e.stopPropagation(); setAssignTarget(asset) }}
                        >
                          Assign
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <Package className="size-14 text-ds-neutral-200 mb-4" />
              <p className="text-ds-body font-semibold text-ds-neutral-500">No assets found</p>
              <p className="text-ds-body-sm text-ds-neutral-400">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </SectionCard>

      {selectedAsset && (
        <AssetDetailDrawer
          asset={selectedAsset}
          allocations={assetAllocations}
          onClose={() => setSelectedAsset(null)}
          onAssign={() => { setAssignTarget(selectedAsset); setSelectedAsset(null) }}
        />
      )}

      {assignTarget && (
        <AssignAssetModal
          asset={assignTarget}
          onClose={() => setAssignTarget(null)}
        />
      )}
    </div>
  )
}
