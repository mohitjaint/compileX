"use client"

import { useState } from "react"
import { Search, TrendingUp, TrendingDown, Minus, Trophy, Medal, Award } from "lucide-react"

const users = [
  { rank: 1, username: "tourist", rating: 3856, maxRating: 3856, country: "BY", solved: 4823, contests: 187, change: 0 },
  { rank: 2, username: "Petr", rating: 3721, maxRating: 3756, country: "RU", solved: 4156, contests: 203, change: 12 },
  { rank: 3, username: "Um_nik", rating: 3698, maxRating: 3715, country: "UA", solved: 3987, contests: 156, change: -5 },
  { rank: 4, username: "ecnerwala", rating: 3654, maxRating: 3691, country: "US", solved: 3542, contests: 142, change: 8 },
  { rank: 5, username: "Benq", rating: 3612, maxRating: 3645, country: "US", solved: 3891, contests: 178, change: 0 },
  { rank: 6, username: "maroonrk", rating: 3589, maxRating: 3621, country: "JP", solved: 3234, contests: 134, change: 15 },
  { rank: 7, username: "ksun48", rating: 3567, maxRating: 3598, country: "US", solved: 3456, contests: 145, change: -3 },
  { rank: 8, username: "Radewoosh", rating: 3534, maxRating: 3589, country: "PL", solved: 3123, contests: 128, change: 21 },
  { rank: 9, username: "mnbvmar", rating: 3512, maxRating: 3534, country: "PL", solved: 2987, contests: 112, change: 0 },
  { rank: 10, username: "apiad", rating: 3489, maxRating: 3512, country: "CN", solved: 3654, contests: 167, change: -8 },
  { rank: 47, username: "you", rating: 1847, maxRating: 1923, country: "IN", solved: 342, contests: 28, change: 52, isCurrentUser: true },
]

const getRatingColor = (rating: number) => {
  if (rating >= 3000) return "text-red-500"
  if (rating >= 2600) return "text-red-400"
  if (rating >= 2400) return "text-orange-400"
  if (rating >= 2200) return "text-orange-300"
  if (rating >= 1900) return "text-violet-400"
  if (rating >= 1600) return "text-blue-400"
  if (rating >= 1400) return "text-cyan-400"
  if (rating >= 1200) return "text-success"
  return "text-muted-foreground"
}

const getRatingBadge = (rating: number) => {
  if (rating >= 3000) return "Legendary Grandmaster"
  if (rating >= 2600) return "International Grandmaster"
  if (rating >= 2400) return "Grandmaster"
  if (rating >= 2200) return "International Master"
  if (rating >= 1900) return "Master"
  if (rating >= 1600) return "Candidate Master"
  if (rating >= 1400) return "Expert"
  if (rating >= 1200) return "Specialist"
  return "Newbie"
}

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [timeRange, setTimeRange] = useState("all")

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Global Leaderboard</h1>
        <p className="text-muted-foreground">Rankings based on contest performance and problem solving</p>
      </div>

      {/* Top 3 Podium */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {users.slice(0, 3).map((user, index) => (
          <div
            key={user.username}
            className={`relative rounded-xl border border-border bg-card p-6 ${
              index === 0 ? "md:order-2 md:-mt-4" : index === 1 ? "md:order-1" : "md:order-3"
            }`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              {index === 0 && <Trophy className="h-8 w-8 text-yellow-500" />}
              {index === 1 && <Medal className="h-8 w-8 text-gray-400" />}
              {index === 2 && <Award className="h-8 w-8 text-orange-600" />}
            </div>
            <div className="mt-4 text-center">
              <div className="text-3xl font-bold">#{user.rank}</div>
              <div className={`mt-2 text-xl font-semibold ${getRatingColor(user.rating)}`}>
                {user.username}
              </div>
              <div className="text-sm text-muted-foreground">{getRatingBadge(user.rating)}</div>
              <div className={`mt-3 text-2xl font-mono font-bold ${getRatingColor(user.rating)}`}>
                {user.rating}
              </div>
              <div className="mt-2 flex justify-center gap-4 text-sm text-muted-foreground">
                <span>{user.solved} solved</span>
                <span>{user.contests} contests</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary/50 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          {["all", "month", "week"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                timeRange === range
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {range === "all" ? "All Time" : range === "month" ? "This Month" : "This Week"}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-xl border border-border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-sm text-muted-foreground">
              <th className="px-6 py-4 font-medium">Rank</th>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Rating</th>
              <th className="px-6 py-4 font-medium">Max Rating</th>
              <th className="px-6 py-4 font-medium text-center">Problems</th>
              <th className="px-6 py-4 font-medium text-center">Contests</th>
              <th className="px-6 py-4 font-medium text-right">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredUsers.map((user) => (
              <tr
                key={user.username}
                className={`${user.isCurrentUser ? "bg-primary/10" : "hover:bg-secondary/30"}`}
              >
                <td className="px-6 py-4">
                  <span className="font-medium">#{user.rank}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                      {user.country}
                    </div>
                    <div>
                      <div className={`font-medium ${getRatingColor(user.rating)} ${user.isCurrentUser ? "font-semibold" : ""}`}>
                        {user.username}
                        {user.isCurrentUser && " (you)"}
                      </div>
                      <div className="text-xs text-muted-foreground">{getRatingBadge(user.rating)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-mono font-bold ${getRatingColor(user.rating)}`}>
                    {user.rating}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-mono ${getRatingColor(user.maxRating)}`}>
                    {user.maxRating}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-muted-foreground">{user.solved.toLocaleString()}</td>
                <td className="px-6 py-4 text-center text-muted-foreground">{user.contests}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {user.change > 0 ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-success" />
                        <span className="text-success">+{user.change}</span>
                      </>
                    ) : user.change < 0 ? (
                      <>
                        <TrendingDown className="h-4 w-4 text-error" />
                        <span className="text-error">{user.change}</span>
                      </>
                    ) : (
                      <>
                        <Minus className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">0</span>
                      </>
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
