import { useState, useEffect, useMemo } from 'react'
import Papa from 'papaparse'

interface HospitalRecord {
  healthBlock: string
  facilityName: string
  formatType: string
  deliveries: number
}

const BLOCK_COLORS: Record<string, string> = {
  'Gohana': '#0ea5e9',
  'Kharkhoda': '#8b5cf6',
  'SONIPAT URBAN': '#0d9488',
  'Gannaur': '#f59e0b',
  'Badkhalsa': '#ef4444',
  'Halalpur': '#64748b',
}

const TOP_N_OPTIONS = [10, 20, 30] as const

function App() {
  const [data, setData] = useState<HospitalRecord[]>([])
  const [selectedBlocks, setSelectedBlocks] = useState<Set<string>>(new Set())
  const [topN, setTopN] = useState<number>(20)

  useEffect(() => {
    fetch('/delivery.csv')
      .then((res) => res.text())
      .then((csv) => {
        const parsed = Papa.parse(csv, { skipEmptyLines: true })
        const rows = parsed.data as string[][]

        const records: HospitalRecord[] = []
        for (let i = 4; i < rows.length; i++) {
          const row = rows[i]
          if (!row[0] || !row[2] || !row[4]) continue
          const deliveries = parseInt(row[4], 10)
          if (isNaN(deliveries) || deliveries === 0) continue
          records.push({
            healthBlock: row[0].trim(),
            facilityName: row[2].trim(),
            formatType: row[1]?.trim() ?? '',
            deliveries,
          })
        }

        records.sort((a, b) => b.deliveries - a.deliveries)
        setData(records)

        const blocks = new Set(records.map((r) => r.healthBlock))
        setSelectedBlocks(blocks)
      })
  }, [])

  const allBlocks = useMemo(
    () => [...new Set(data.map((r) => r.healthBlock))],
    [data],
  )

  const filtered = useMemo(() => {
    return data
      .filter((r) => selectedBlocks.has(r.healthBlock))
      .slice(0, topN)
  }, [data, selectedBlocks, topN])

  const toggleBlock = (block: string) => {
    setSelectedBlocks((prev) => {
      const next = new Set(prev)
      if (next.has(block)) {
        if (next.size > 1) next.delete(block)
      } else {
        next.add(block)
      }
      return next
    })
  }

  const selectAll = () => {
    setSelectedBlocks(new Set(allBlocks))
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          Private Hospital Deliveries — Sonipat
        </h1>
      </header>

      {/* Controls */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-600 mr-1">Districts:</span>
          {allBlocks.map((block) => (
            <button
              key={block}
              onClick={() => toggleBlock(block)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                selectedBlocks.has(block)
                  ? 'text-white shadow-sm'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
              style={
                selectedBlocks.has(block)
                  ? { backgroundColor: BLOCK_COLORS[block] ?? '#64748b' }
                  : undefined
              }
            >
              {block}
            </button>
          ))}
          <button
            onClick={selectAll}
            className="px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer ml-1"
          >
            All
          </button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <label htmlFor="topN" className="text-sm font-medium text-slate-600">
            Show:
          </label>
          <select
            id="topN"
            value={topN}
            onChange={(e) => setTopN(Number(e.target.value))}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {TOP_N_OPTIONS.map((n) => (
              <option key={n} value={n}>
                Top {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hospital List */}
      <div className="px-6 py-6">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-400 py-20">
              No data to display
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filtered.map((record, index) => {
                const color = BLOCK_COLORS[record.healthBlock] ?? '#64748b'
                const name = record.facilityName.length > 20
                  ? record.facilityName.slice(0, 20) + '...'
                  : record.facilityName
                return (
                  <li
                    key={index}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-sm text-slate-400 w-6 text-right shrink-0">
                      {index + 1}
                    </span>
                    <span
                      className="w-3 h-3 rounded-sm shrink-0"
                      style={{ backgroundColor: color }}
                      title={record.healthBlock}
                    />
                    <span className="text-sm font-medium text-slate-900 flex-1">
                      {name}
                    </span>
                    <span className="text-sm font-semibold text-slate-700 tabular-nums shrink-0">
                      {record.deliveries}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
