"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Copy, 
  Eye,
  Calendar,
  Users,
  Clock
} from "lucide-react"

const contests = [
  {
    id: "weekly-25",
    name: "Weekly Contest #25",
    type: "ICPC",
    status: "active",
    startTime: "May 9, 2026 14:00 UTC",
    duration: "2h 30m",
    problems: 5,
    participants: 1247,
    rated: true,
  },
  {
    id: "algo-masters-3",
    name: "Algorithm Masters Round 3",
    type: "Codeforces",
    status: "active",
    startTime: "May 9, 2026 15:30 UTC",
    duration: "2h",
    problems: 6,
    participants: 856,
    rated: true,
  },
  {
    id: "div2-45",
    name: "Division 2 Round #45",
    type: "Codeforces",
    status: "scheduled",
    startTime: "May 11, 2026 18:00 UTC",
    duration: "2h",
    problems: 5,
    participants: 2341,
    rated: true,
  },
  {
    id: "monthly-may",
    name: "Monthly Challenge May",
    type: "IOI",
    status: "scheduled",
    startTime: "May 14, 2026 10:00 UTC",
    duration: "5h",
    problems: 4,
    participants: 1876,
    rated: true,
  },
  {
    id: "spring-finals",
    name: "Spring Championship Finals",
    type: "ICPC",
    status: "ended",
    startTime: "May 5, 2026 09:00 UTC",
    duration: "5h",
    problems: 12,
    participants: 3421,
    rated: true,
  },
  {
    id: "beginner-11",
    name: "Beginner Friendly Contest #11",
    type: "Educational",
    status: "ended",
    startTime: "May 2, 2026 12:00 UTC",
    duration: "3h",
    problems: 4,
    participants: 678,
    rated: false,
  },
]

const statusStyles = {
  active: "bg-success/10 text-success",
  scheduled: "bg-info/10 text-info",
  ended: "bg-muted text-muted-foreground",
  draft: "bg-warning/10 text-warning",
}

export default function AdminContestsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const filteredContests = contests.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Contests</h1>
          <p className="text-muted-foreground">Create and manage competitive programming contests</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Contest
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search contests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary/50 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          <select className="rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All Status</option>
            <option>Active</option>
            <option>Scheduled</option>
            <option>Ended</option>
            <option>Draft</option>
          </select>
          <select className="rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All Types</option>
            <option>ICPC</option>
            <option>Codeforces</option>
            <option>IOI</option>
            <option>Educational</option>
          </select>
        </div>
      </div>

      {/* Contests Table */}
      <div className="rounded-xl border border-border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-sm text-muted-foreground">
              <th className="px-6 py-4 font-medium">Contest</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Schedule</th>
              <th className="px-6 py-4 font-medium text-center">Problems</th>
              <th className="px-6 py-4 font-medium text-center">Participants</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredContests.map((contest) => (
              <tr key={contest.id} className="hover:bg-secondary/30">
                <td className="px-6 py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{contest.name}</span>
                      {contest.rated && (
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">Rated</span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">{contest.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[contest.status as keyof typeof statusStyles]}`}>
                    {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {contest.startTime}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {contest.duration}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">{contest.problems}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {contest.participants.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setOpenDropdown(openDropdown === contest.id ? null : contest.id)}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                    {openDropdown === contest.id && (
                      <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-border bg-card py-1 shadow-lg">
                        <button className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-secondary">
                          <Eye className="h-4 w-4" />
                          View Contest
                        </button>
                        <button className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-secondary">
                          <Edit className="h-4 w-4" />
                          Edit Contest
                        </button>
                        <button className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-secondary">
                          <Copy className="h-4 w-4" />
                          Duplicate
                        </button>
                        <div className="my-1 border-t border-border" />
                        <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-error hover:bg-secondary">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
