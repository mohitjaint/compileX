"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

type Verdict = "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Runtime Error" | "Compilation Error" | "Memory Limit Exceeded" | "Pending"

const submissions = [
  { id: "12847", problem: "Two Sum", problemId: "two-sum", verdict: "Accepted" as Verdict, language: "C++17", time: "12ms", memory: "8.2 MB", submittedAt: "2 minutes ago" },
  { id: "12846", problem: "Binary Search Tree Validation", problemId: "bst", verdict: "Wrong Answer" as Verdict, language: "Python 3", time: "-", memory: "-", submittedAt: "15 minutes ago" },
  { id: "12845", problem: "Binary Search Tree Validation", problemId: "bst", verdict: "Wrong Answer" as Verdict, language: "Python 3", time: "-", memory: "-", submittedAt: "18 minutes ago" },
  { id: "12844", problem: "Graph Shortest Path", problemId: "graph-dijkstra", verdict: "Time Limit Exceeded" as Verdict, language: "Java 17", time: "2000ms", memory: "64 MB", submittedAt: "1 hour ago" },
  { id: "12843", problem: "Graph Shortest Path", problemId: "graph-dijkstra", verdict: "Time Limit Exceeded" as Verdict, language: "Java 17", time: "2000ms", memory: "58 MB", submittedAt: "1 hour ago" },
  { id: "12842", problem: "Dynamic Programming Challenge", problemId: "dp-knapsack", verdict: "Accepted" as Verdict, language: "C++17", time: "45ms", memory: "12 MB", submittedAt: "2 hours ago" },
  { id: "12841", problem: "Dynamic Programming Challenge", problemId: "dp-knapsack", verdict: "Runtime Error" as Verdict, language: "C++17", time: "-", memory: "-", submittedAt: "2 hours ago" },
  { id: "12840", problem: "String Matching", problemId: "kmp", verdict: "Accepted" as Verdict, language: "C++17", time: "8ms", memory: "4.5 MB", submittedAt: "3 hours ago" },
  { id: "12839", problem: "Array Manipulation", problemId: "array-ops", verdict: "Memory Limit Exceeded" as Verdict, language: "Java 17", time: "156ms", memory: "512 MB", submittedAt: "5 hours ago" },
  { id: "12838", problem: "Sorting Algorithm", problemId: "merge-sort", verdict: "Accepted" as Verdict, language: "Python 3", time: "234ms", memory: "32 MB", submittedAt: "1 day ago" },
  { id: "12837", problem: "Tree Traversal", problemId: "tree-dfs", verdict: "Compilation Error" as Verdict, language: "Rust", time: "-", memory: "-", submittedAt: "1 day ago" },
  { id: "12836", problem: "Linked List Operations", problemId: "linked-list", verdict: "Accepted" as Verdict, language: "Go", time: "4ms", memory: "2.1 MB", submittedAt: "2 days ago" },
]

const verdictStyles: Record<Verdict, string> = {
  "Accepted": "bg-success/10 text-success border-success/30",
  "Wrong Answer": "bg-error/10 text-error border-error/30",
  "Time Limit Exceeded": "bg-warning/10 text-warning border-warning/30",
  "Runtime Error": "bg-error/10 text-error border-error/30",
  "Compilation Error": "bg-orange-500/10 text-orange-500 border-orange-500/30",
  "Memory Limit Exceeded": "bg-warning/10 text-warning border-warning/30",
  "Pending": "bg-muted text-muted-foreground border-border",
}

const verdictLabels: Record<Verdict, string> = {
  "Accepted": "AC",
  "Wrong Answer": "WA",
  "Time Limit Exceeded": "TLE",
  "Runtime Error": "RE",
  "Compilation Error": "CE",
  "Memory Limit Exceeded": "MLE",
  "Pending": "...",
}

export default function SubmissionsPage() {
  const [filter, setFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSubmissions = submissions.filter(sub => {
    const matchesFilter = filter === "all" || sub.verdict === filter
    const matchesSearch = sub.problem.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: submissions.length,
    accepted: submissions.filter(s => s.verdict === "Accepted").length,
    wa: submissions.filter(s => s.verdict === "Wrong Answer").length,
    tle: submissions.filter(s => s.verdict === "Time Limit Exceeded").length,
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Submissions</h1>
        <p className="text-muted-foreground">View your submission history and verdicts</p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Submissions</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-2xl font-bold text-success">{stats.accepted}</div>
          <div className="text-sm text-muted-foreground">Accepted</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-2xl font-bold text-error">{stats.wa}</div>
          <div className="text-sm text-muted-foreground">Wrong Answer</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-2xl font-bold text-warning">{stats.tle}</div>
          <div className="text-sm text-muted-foreground">Time Limit</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary/50 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error"].map((verdict) => (
            <button
              key={verdict}
              onClick={() => setFilter(verdict)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === verdict
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {verdict === "all" ? "All" : verdictLabels[verdict as Verdict]}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-sm text-muted-foreground">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Problem</th>
                <th className="px-6 py-4 font-medium">Verdict</th>
                <th className="px-6 py-4 font-medium">Language</th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Memory</th>
                <th className="px-6 py-4 font-medium text-right">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-secondary/30">
                  <td className="px-6 py-4 font-mono text-sm text-muted-foreground">
                    #{submission.id}
                  </td>
                  <td className="px-6 py-4">
                    <Link 
                      href={`/problems/${submission.problemId}`}
                      className="flex items-center gap-2 font-medium hover:text-primary"
                    >
                      {submission.problem}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${verdictStyles[submission.verdict]}`}>
                      {verdictLabels[submission.verdict]}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">{submission.language}</td>
                  <td className="px-6 py-4 font-mono text-sm text-muted-foreground">{submission.time}</td>
                  <td className="px-6 py-4 font-mono text-sm text-muted-foreground">{submission.memory}</td>
                  <td className="px-6 py-4 text-right text-sm text-muted-foreground">{submission.submittedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredSubmissions.length} of {submissions.length} submissions
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
