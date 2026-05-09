"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Activity, 
  RefreshCw, 
  Power, 
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from "lucide-react"

type WorkerStatus = "online" | "offline" | "degraded"

const workers = [
  {
    id: "worker-01",
    name: "Judge Worker 01",
    region: "us-east-1",
    status: "online" as WorkerStatus,
    cpu: 45,
    memory: 62,
    disk: 34,
    queueSize: 8,
    currentTask: "Judging submission #12847",
    uptime: "14d 6h 23m",
    lastHeartbeat: "2s ago",
  },
  {
    id: "worker-02",
    name: "Judge Worker 02",
    region: "us-east-1",
    status: "online" as WorkerStatus,
    cpu: 78,
    memory: 81,
    disk: 45,
    queueSize: 12,
    currentTask: "Judging submission #12846",
    uptime: "14d 6h 23m",
    lastHeartbeat: "1s ago",
  },
  {
    id: "worker-03",
    name: "Judge Worker 03",
    region: "us-west-2",
    status: "online" as WorkerStatus,
    cpu: 23,
    memory: 45,
    disk: 28,
    queueSize: 3,
    currentTask: "Idle",
    uptime: "7d 12h 45m",
    lastHeartbeat: "1s ago",
  },
  {
    id: "worker-04",
    name: "Judge Worker 04",
    region: "us-west-2",
    status: "degraded" as WorkerStatus,
    cpu: 92,
    memory: 95,
    disk: 78,
    queueSize: 15,
    currentTask: "Judging submission #12844",
    uptime: "7d 12h 45m",
    lastHeartbeat: "5s ago",
  },
  {
    id: "worker-05",
    name: "Judge Worker 05",
    region: "eu-west-1",
    status: "online" as WorkerStatus,
    cpu: 56,
    memory: 68,
    disk: 41,
    queueSize: 6,
    currentTask: "Judging submission #12843",
    uptime: "21d 3h 12m",
    lastHeartbeat: "2s ago",
  },
  {
    id: "worker-06",
    name: "Judge Worker 06",
    region: "eu-west-1",
    status: "offline" as WorkerStatus,
    cpu: 0,
    memory: 0,
    disk: 52,
    queueSize: 0,
    currentTask: "Offline",
    uptime: "-",
    lastHeartbeat: "5m ago",
  },
  {
    id: "worker-07",
    name: "Judge Worker 07",
    region: "ap-southeast-1",
    status: "online" as WorkerStatus,
    cpu: 34,
    memory: 52,
    disk: 29,
    queueSize: 4,
    currentTask: "Idle",
    uptime: "3d 18h 56m",
    lastHeartbeat: "1s ago",
  },
  {
    id: "worker-08",
    name: "Judge Worker 08",
    region: "ap-southeast-1",
    status: "offline" as WorkerStatus,
    cpu: 0,
    memory: 0,
    disk: 44,
    queueSize: 0,
    currentTask: "Offline",
    uptime: "-",
    lastHeartbeat: "12m ago",
  },
]

const statusConfig = {
  online: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Online" },
  offline: { icon: XCircle, color: "text-error", bg: "bg-error/10", label: "Offline" },
  degraded: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", label: "Degraded" },
}

const getUsageColor = (value: number) => {
  if (value >= 90) return "bg-error"
  if (value >= 70) return "bg-warning"
  return "bg-success"
}

export default function WorkersPage() {
  const [selectedRegion, setSelectedRegion] = useState("all")

  const regions = ["all", ...new Set(workers.map(w => w.region))]
  const filteredWorkers = selectedRegion === "all" 
    ? workers 
    : workers.filter(w => w.region === selectedRegion)

  const onlineCount = workers.filter(w => w.status === "online").length
  const degradedCount = workers.filter(w => w.status === "degraded").length
  const offlineCount = workers.filter(w => w.status === "offline").length

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Worker Nodes</h1>
          <p className="text-muted-foreground">Monitor and manage distributed judge workers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Worker
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <Server className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold">{workers.length}</div>
              <div className="text-sm text-muted-foreground">Total Workers</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold text-success">{onlineCount}</div>
              <div className="text-sm text-muted-foreground">Online</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">{degradedCount}</div>
              <div className="text-sm text-muted-foreground">Degraded</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-error/10">
              <XCircle className="h-5 w-5 text-error" />
            </div>
            <div>
              <div className="text-2xl font-bold text-error">{offlineCount}</div>
              <div className="text-sm text-muted-foreground">Offline</div>
            </div>
          </div>
        </div>
      </div>

      {/* Region Filter */}
      <div className="mb-6 flex gap-2">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedRegion === region
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {region === "all" ? "All Regions" : region}
          </button>
        ))}
      </div>

      {/* Worker Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredWorkers.map((worker) => {
          const status = statusConfig[worker.status]
          const StatusIcon = status.icon

          return (
            <div
              key={worker.id}
              className={`rounded-xl border bg-card p-6 ${
                worker.status === "offline" ? "border-border opacity-60" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${status.bg}`}>
                    <Server className={`h-5 w-5 ${status.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{worker.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{worker.region}</span>
                      <span>&middot;</span>
                      <span>Heartbeat: {worker.lastHeartbeat}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${status.bg} ${status.color}`}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>
                  <Button variant="ghost" size="sm">
                    <Power className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {worker.status !== "offline" && (
                <>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Cpu className="h-4 w-4" />
                          CPU
                        </span>
                        <span className="font-mono">{worker.cpu}%</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-secondary">
                        <div 
                          className={`h-full rounded-full ${getUsageColor(worker.cpu)}`}
                          style={{ width: `${worker.cpu}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Activity className="h-4 w-4" />
                          Memory
                        </span>
                        <span className="font-mono">{worker.memory}%</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-secondary">
                        <div 
                          className={`h-full rounded-full ${getUsageColor(worker.memory)}`}
                          style={{ width: `${worker.memory}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <HardDrive className="h-4 w-4" />
                          Disk
                        </span>
                        <span className="font-mono">{worker.disk}%</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-secondary">
                        <div 
                          className={`h-full rounded-full ${getUsageColor(worker.disk)}`}
                          style={{ width: `${worker.disk}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Current Task</div>
                      <div className="font-mono text-sm">{worker.currentTask}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Queue</div>
                      <div className="font-mono text-sm">{worker.queueSize} pending</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Uptime: {worker.uptime}</span>
                  </div>
                </>
              )}

              {worker.status === "offline" && (
                <div className="mt-4 rounded-lg bg-error/10 p-4 text-center">
                  <p className="text-sm text-error">Worker is offline. Last seen {worker.lastHeartbeat}</p>
                  <Button size="sm" className="mt-2">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Restart Worker
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
