import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, Trophy, Filter, Plus } from "lucide-react"

const contests = [
  {
    id: "weekly-25",
    name: "Weekly Contest #25",
    type: "ICPC",
    status: "active",
    participants: 1247,
    startTime: "May 9, 2026 14:00 UTC",
    duration: "2h 30m",
    problems: 5,
    rated: true,
  },
  {
    id: "algo-masters",
    name: "Algorithm Masters Round 3",
    type: "Codeforces",
    status: "active",
    participants: 856,
    startTime: "May 9, 2026 15:30 UTC",
    duration: "2h",
    problems: 6,
    rated: true,
  },
  {
    id: "div2-round-45",
    name: "Division 2 Round #45",
    type: "Codeforces",
    status: "upcoming",
    participants: 2341,
    startTime: "May 11, 2026 18:00 UTC",
    duration: "2h",
    problems: 5,
    rated: true,
  },
  {
    id: "monthly-challenge",
    name: "Monthly Challenge May",
    type: "IOI",
    status: "upcoming",
    participants: 1876,
    startTime: "May 14, 2026 10:00 UTC",
    duration: "5h",
    problems: 4,
    rated: true,
  },
  {
    id: "beginner-12",
    name: "Beginner Friendly Contest #12",
    type: "Educational",
    status: "upcoming",
    participants: 543,
    startTime: "May 16, 2026 12:00 UTC",
    duration: "3h",
    problems: 4,
    rated: false,
  },
  {
    id: "spring-finals",
    name: "Spring Championship Finals",
    type: "ICPC",
    status: "ended",
    participants: 3421,
    startTime: "May 5, 2026 09:00 UTC",
    duration: "5h",
    problems: 12,
    rated: true,
  },
]

const statusStyles = {
  active: "bg-success/10 text-success border-success/30",
  upcoming: "bg-info/10 text-info border-info/30",
  ended: "bg-muted text-muted-foreground border-border",
}

const statusLabels = {
  active: "Live",
  upcoming: "Upcoming",
  ended: "Ended",
}

export default function ContestsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contests</h1>
          <p className="text-muted-foreground">Browse and participate in coding competitions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create Contest
          </Button>
        </div>
      </div>

      {/* Active Contests */}
      <div className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <span className="flex h-2 w-2 animate-pulse rounded-full bg-success" />
          Active Contests
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {contests
            .filter((c) => c.status === "active")
            .map((contest) => (
              <Link
                key={contest.id}
                href={`/contests/${contest.id}`}
                className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{contest.name}</h3>
                      {contest.rated && (
                        <Trophy className="h-4 w-4 text-warning" />
                      )}
                    </div>
                    <span className="mt-1 inline-block rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                      {contest.type}
                    </span>
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyles[contest.status]}`}>
                    {statusLabels[contest.status]}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {contest.participants.toLocaleString()} participants
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {contest.duration}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>

      {/* Upcoming Contests */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Upcoming Contests</h2>
        <div className="rounded-xl border border-border bg-card">
          <div className="divide-y divide-border">
            {contests
              .filter((c) => c.status === "upcoming")
              .map((contest) => (
                <div key={contest.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{contest.name}</h3>
                      {contest.rated && <Trophy className="h-4 w-4 text-warning" />}
                      <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                        {contest.type}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {contest.startTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {contest.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {contest.participants.toLocaleString()} registered
                      </span>
                    </div>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/contests/${contest.id}`}>Register</Link>
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Past Contests */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Past Contests</h2>
        <div className="rounded-xl border border-border bg-card">
          <div className="divide-y divide-border">
            {contests
              .filter((c) => c.status === "ended")
              .map((contest) => (
                <div key={contest.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{contest.name}</h3>
                      {contest.rated && <Trophy className="h-4 w-4 text-warning" />}
                      <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                        {contest.type}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {contest.startTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {contest.participants.toLocaleString()} participants
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/contests/${contest.id}`}>View Results</Link>
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
