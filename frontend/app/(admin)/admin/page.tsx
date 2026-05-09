import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Trophy, 
  FileCode, 
  Users, 
  Server, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock,
  TrendingUp,
  Plus
} from "lucide-react"

const stats = [
  { label: "Active Contests", value: "3", change: "+1 today", icon: Trophy, color: "text-primary" },
  { label: "Total Problems", value: "3,250", change: "+12 this week", icon: FileCode, color: "text-info" },
  { label: "Registered Users", value: "12,847", change: "+234 today", icon: Users, color: "text-success" },
  { label: "Worker Nodes", value: "8/10", change: "2 offline", icon: Server, color: "text-warning" },
]

const recentSubmissions = [
  { id: "12847", user: "tourist", problem: "Two Sum", verdict: "Accepted", time: "12ms" },
  { id: "12846", user: "Petr", problem: "Graph DFS", verdict: "Wrong Answer", time: "-" },
  { id: "12845", user: "Um_nik", problem: "DP Challenge", verdict: "Accepted", time: "45ms" },
  { id: "12844", user: "ecnerwala", problem: "Tree Query", verdict: "Time Limit", time: "2000ms" },
  { id: "12843", user: "Benq", problem: "String Hash", verdict: "Accepted", time: "8ms" },
]

const queueStats = {
  pending: 47,
  judging: 12,
  completed: 2847,
  failed: 23,
}

export default function AdminOverviewPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your competitive programming platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/problems">
              <Plus className="mr-2 h-4 w-4" />
              Add Problem
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/contests">
              <Plus className="mr-2 h-4 w-4" />
              Create Contest
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-secondary ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="text-xs text-muted-foreground">{stat.change}</span>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Queue Status */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <h2 className="font-semibold">Queue Status</h2>
              <p className="text-sm text-muted-foreground">Submission processing overview</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/queue">View Details</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 p-6">
            <div className="rounded-lg bg-secondary/50 p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <div className="mt-2 text-3xl font-bold">{queueStats.pending}</div>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-info" />
                <span className="text-sm text-muted-foreground">Judging</span>
              </div>
              <div className="mt-2 text-3xl font-bold">{queueStats.judging}</div>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <div className="mt-2 text-3xl font-bold">{queueStats.completed.toLocaleString()}</div>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-error" />
                <span className="text-sm text-muted-foreground">Failed</span>
              </div>
              <div className="mt-2 text-3xl font-bold">{queueStats.failed}</div>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <h2 className="font-semibold">Recent Submissions</h2>
              <p className="text-sm text-muted-foreground">Latest judged submissions</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/submissions">View All</Link>
            </Button>
          </div>
          <div className="divide-y divide-border">
            {recentSubmissions.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-muted-foreground">#{sub.id}</span>
                    <span className="font-medium">{sub.user}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{sub.problem}</div>
                </div>
                <div className="text-right">
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                    sub.verdict === "Accepted" ? "bg-success/10 text-success" :
                    sub.verdict === "Wrong Answer" ? "bg-error/10 text-error" :
                    "bg-warning/10 text-warning"
                  }`}>
                    {sub.verdict === "Accepted" ? "AC" : sub.verdict === "Wrong Answer" ? "WA" : "TLE"}
                  </span>
                  <div className="mt-1 font-mono text-xs text-muted-foreground">{sub.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="mt-8 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="font-semibold">System Health</h2>
            <p className="text-sm text-muted-foreground">Overall platform status</p>
          </div>
          <span className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
            <span className="h-2 w-2 rounded-full bg-success" />
            All Systems Operational
          </span>
        </div>
        <div className="grid grid-cols-2 gap-6 p-6 md:grid-cols-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">API Response</span>
              <span className="text-sm font-medium text-success">45ms</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-secondary">
              <div className="h-full w-[15%] rounded-full bg-success" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Database Load</span>
              <span className="text-sm font-medium text-success">23%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-secondary">
              <div className="h-full w-[23%] rounded-full bg-success" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Queue Depth</span>
              <span className="text-sm font-medium text-warning">47</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-secondary">
              <div className="h-full w-[47%] rounded-full bg-warning" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Worker Capacity</span>
              <span className="text-sm font-medium text-success">80%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-secondary">
              <div className="h-full w-[80%] rounded-full bg-success" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
