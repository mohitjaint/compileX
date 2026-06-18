"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock, Users, Trophy, CheckCircle2, XCircle, Timer } from "lucide-react"

// Mock contest data
const contest = {
  id: "weekly-25",
  name: "Weekly Contest #25",
  type: "ICPC",
  status: "active",
  timeRemaining: "1:23:45",
  participants: 1247,
  duration: "2h 30m",
  rated: true,
}

const problems = [
  { id: "A", name: "Two Sum", difficulty: "Easy", points: 100, solved: true, attempts: 1 },
  { id: "B", name: "Binary Search Tree Validation", difficulty: "Medium", points: 200, solved: true, attempts: 2 },
  { id: "C", name: "Graph Shortest Path", difficulty: "Medium", points: 300, solved: false, attempts: 3 },
  { id: "D", name: "Dynamic Programming Challenge", difficulty: "Hard", points: 400, solved: false, attempts: 0 },
  { id: "E", name: "Advanced Tree Algorithms", difficulty: "Hard", points: 500, solved: false, attempts: 0 },
]

const leaderboard = [
  { rank: 1, username: "tourist", score: 1500, solved: 5, penalty: "0:45:23" },
  { rank: 2, username: "Petr", score: 1400, solved: 5, penalty: "0:52:11" },
  { rank: 3, username: "Um_nik", score: 1300, solved: 4, penalty: "0:38:45" },
  { rank: 4, username: "ecnerwala", score: 1200, solved: 4, penalty: "0:41:22" },
  { rank: 5, username: "Benq", score: 1100, solved: 4, penalty: "0:44:56" },
  { rank: 47, username: "you", score: 300, solved: 2, penalty: "0:28:12", isCurrentUser: true },
]

const difficultyColors = {
  Easy: "text-success",
  Medium: "text-warning",
  Hard: "text-error",
}

type Tab = "problems" | "leaderboard" | "submissions"

export default function ContestPage() {
  const [activeTab, setActiveTab] = useState<Tab>("problems")

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Contest Header */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{contest.name}</h1>
              {contest.rated && <Trophy className="h-5 w-5 text-warning" />}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="rounded bg-secondary px-2 py-0.5">{contest.type}</span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {contest.participants.toLocaleString()} participants
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {contest.duration}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-2 text-3xl font-mono font-bold text-primary">
                <Timer className="h-6 w-6" />
                {contest.timeRemaining}
              </div>
              <div className="text-sm text-muted-foreground">Time Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">2/5</div>
              <div className="text-sm text-muted-foreground">Solved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">#47</div>
              <div className="text-sm text-muted-foreground">Rank</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg border border-border bg-card p-1">
        {(["problems", "leaderboard", "submissions"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "problems" && (
        <div className="rounded-xl border border-border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-sm text-muted-foreground">
                <th className="px-6 py-4 font-medium">#</th>
                <th className="px-6 py-4 font-medium">Problem</th>
                <th className="px-6 py-4 font-medium">Difficulty</th>
                <th className="px-6 py-4 font-medium text-center">Points</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {problems.map((problem) => (
                <tr key={problem.id} className="hover:bg-secondary/30">
                  <td className="px-6 py-4 font-mono font-medium">{problem.id}</td>
                  <td className="px-6 py-4">
                    <Link href={`/problems/${problem.id.toLowerCase()}`} className="hover:text-primary">
                      {problem.name}
                    </Link>
                  </td>
                  <td className={`px-6 py-4 ${difficultyColors[problem.difficulty as keyof typeof difficultyColors]}`}>
                    {problem.difficulty}
                  </td>
                  <td className="px-6 py-4 text-center font-mono">{problem.points}</td>
                  <td className="px-6 py-4 text-center">
                    {problem.solved ? (
                      <CheckCircle2 className="mx-auto h-5 w-5 text-success" />
                    ) : problem.attempts > 0 ? (
                      <div className="flex items-center justify-center gap-1">
                        <XCircle className="h-5 w-5 text-error" />
                        <span className="text-xs text-muted-foreground">x{problem.attempts}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button size="sm" variant={problem.solved ? "outline" : "default"} asChild>
                      <Link href={`/contests/${contest.id}/problems/${problem.id.toLowerCase()}`}>
                        {problem.solved ? "View" : "Solve"}
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "leaderboard" && (
        <div className="rounded-xl border border-border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-sm text-muted-foreground">
                <th className="px-6 py-4 font-medium">Rank</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium text-center">Score</th>
                <th className="px-6 py-4 font-medium text-center">Solved</th>
                <th className="px-6 py-4 font-medium text-right">Penalty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leaderboard.map((entry) => (
                <tr 
                  key={entry.username} 
                  className={`${entry.isCurrentUser ? "bg-primary/10" : "hover:bg-secondary/30"}`}
                >
                  <td className="px-6 py-4">
                    {entry.rank <= 3 ? (
                      <span className={`font-bold ${
                        entry.rank === 1 ? "text-warning" : 
                        entry.rank === 2 ? "text-muted-foreground" : 
                        "text-orange-600"
                      }`}>
                        #{entry.rank}
                      </span>
                    ) : (
                      <span>#{entry.rank}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={entry.isCurrentUser ? "font-semibold text-primary" : ""}>
                      {entry.username}
                      {entry.isCurrentUser && " (you)"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-mono font-medium">{entry.score}</td>
                  <td className="px-6 py-4 text-center">{entry.solved}/5</td>
                  <td className="px-6 py-4 text-right font-mono text-muted-foreground">{entry.penalty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "submissions" && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">Your submissions for this contest will appear here.</p>
          <Button className="mt-4" asChild>
            <Link href={`/contests/${contest.id}/problems/a`}>Start Solving</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
