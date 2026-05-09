"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  RefreshCw, 
  Pause, 
  Play, 
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  AlertTriangle
} from "lucide-react"

const queueItems = [
  { id: "12847", user: "tourist", problem: "Two Sum", language: "C++17", status: "judging", worker: "worker-01", elapsed: "2s" },
  { id: "12846", user: "Petr", problem: "Graph DFS", language: "Python 3", status: "judging", worker: "worker-02", elapsed: "5s" },
  { id: "12845", user: "Um_nik", problem: "DP Challenge", language: "Java 17", status: "judging", worker: "worker-04", elapsed: "8s" },
  { id: "12844", user: "ecnerwala", problem: "Tree Query", language: "C++17", status: "pending", worker: null, elapsed: "12s" },
  { id: "12843", user: "Benq", problem: "String Hash", language: "C++17", status: "pending", worker: null, elapsed: "14s" },
  { id: "12842", user: "maroonrk", problem: "Array Sum", language: "Go", status: "pending", worker: null, elapsed: "18s" },
  { id: "12841", user: "ksun48", problem: "Binary Search", language: "Rust", status: "pending", worker: null, elapsed: "22s" },
  { id: "12840", user: "Radewoosh", problem: "Sorting", language: "C++17", status: "pending", worker: null, elapsed: "25s" },
]

const recentResults = [
  { id: "12839", user: "mnbvmar", problem: "Array Ops", verdict: "Accepted", time: "12ms", memory: "8.2 MB" },
  { id: "12838", user: "apiad", problem: "String Match", verdict: "Wrong Answer", time: "-", memory: "-" },
  { id: "12837", user: "newbie123", problem: "Hello World", verdict: "Accepted", time: "1ms", memory: "2.1 MB" },
  { id: "12836", user: "coder456", problem: "Graph BFS", verdict: "Time Limit", time: "2000ms", memory: "64 MB" },
  { id: "12835", user: "algo_master", problem: "DP Coins", verdict: "Accepted", time: "45ms", memory: "16 MB" },
]

const statusConfig = {
  judging: { icon: Activity, color: "text-info", bg: "bg-info/10", label: "Judging" },
  pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Pending" },
  failed: { icon: AlertTriangle, color: "text-error", bg: "bg-error/10", label: "Failed" },
}

export default function QueuePage() {
  const [queuePaused, setQueuePaused] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  // Auto-refresh simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would fetch new data
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const stats = {
    pending: queueItems.filter(i => i.status === "pending").length,
    judging: queueItems.filter(i => i.status === "judging").length,
    avgWaitTime: "15s",
    throughput: "12/min",
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Submission Queue</h1>
          <p className="text-muted-foreground">Monitor real-time submission processing</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button 
            variant={queuePaused ? "default" : "outline"}
            onClick={() => setQueuePaused(!queuePaused)}
          >
            {queuePaused ? (
              <>
                <Play className="mr-2 h-4 w-4" />
                Resume
              </>
            ) : (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Queue Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
              <Activity className="h-5 w-5 text-info" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.judging}</div>
              <div className="text-sm text-muted-foreground">Judging</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.avgWaitTime}</div>
              <div className="text-sm text-muted-foreground">Avg Wait Time</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Activity className="h-5 w-5 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.throughput}</div>
              <div className="text-sm text-muted-foreground">Throughput</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Active Queue */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Active Queue</h2>
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-success" />
            </div>
            <span className="text-sm text-muted-foreground">{queueItems.length} items</span>
          </div>
          <div className="max-h-[500px] overflow-auto">
            <div className="divide-y divide-border">
              {queueItems.map((item) => {
                const status = statusConfig[item.status as keyof typeof statusConfig]
                const StatusIcon = status.icon
                
                return (
                  <div key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-secondary/30">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${status.bg}`}>
                        <StatusIcon className={`h-4 w-4 ${status.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-muted-foreground">#{item.id}</span>
                          <span className="font-medium">{item.user}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{item.problem}</span>
                          <span>&middot;</span>
                          <span className="font-mono">{item.language}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-sm font-medium ${status.color}`}>{status.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.worker ? item.worker : `Waiting ${item.elapsed}`}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Results */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-semibold">Recent Results</h2>
            <span className="text-sm text-muted-foreground">Last 5 judged</span>
          </div>
          <div className="divide-y divide-border">
            {recentResults.map((result) => (
              <div key={result.id} className="flex items-center justify-between px-6 py-4 hover:bg-secondary/30">
                <div className="flex items-center gap-4">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    result.verdict === "Accepted" ? "bg-success/10" :
                    result.verdict === "Wrong Answer" ? "bg-error/10" :
                    "bg-warning/10"
                  }`}>
                    {result.verdict === "Accepted" ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : result.verdict === "Wrong Answer" ? (
                      <XCircle className="h-4 w-4 text-error" />
                    ) : (
                      <Clock className="h-4 w-4 text-warning" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-muted-foreground">#{result.id}</span>
                      <span className="font-medium">{result.user}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{result.problem}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    result.verdict === "Accepted" ? "text-success" :
                    result.verdict === "Wrong Answer" ? "text-error" :
                    "text-warning"
                  }`}>
                    {result.verdict === "Accepted" ? "AC" :
                     result.verdict === "Wrong Answer" ? "WA" : "TLE"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {result.time} / {result.memory}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
