"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import apiFetch from "@/lib/api"; // adjust path if required

import { Button } from "@/components/ui/button";
import { Search, Filter, CheckCircle2 } from "lucide-react";



const difficultyColors = {
  Easy: "text-success bg-success/10",
  Medium: "text-warning bg-warning/10",
  Hard: "text-error bg-error/10",
}

export default function ProblemsPage() {
	const [problems, setProblems] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchProblems = async () => {
					try {
							setLoading(true);

							const response = await apiFetch("/problems/all");

							console.log("Fetched problems:", response.data); // Log the fetched data

							setProblems(response.data);
					} catch (err: any) {
							setError(err.message);
					} finally {
							setLoading(false);
					}
			};

			fetchProblems();
	}, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Problems</h1>
        <p className="text-muted-foreground">Practice coding problems by difficulty and topic</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search problems..."
            className="w-full rounded-lg border border-border bg-secondary/50 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          <select className="rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All Difficulties</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <select className="rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All Topics</option>
            <option>Array</option>
            <option>String</option>
            <option>DP</option>
            <option>Graph</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 flex gap-6 text-sm">
        <div>
          <span className="text-muted-foreground">Total: </span>
          <span className="font-medium">{problems.length}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Solved: </span>
          <span className="font-medium text-success">{problems.filter(p => p.solved).length}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Easy: </span>
          <span className="font-medium">{problems.filter(p => p.difficulty === "Easy").length}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Medium: </span>
          <span className="font-medium">{problems.filter(p => p.difficulty === "Medium").length}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Hard: </span>
          <span className="font-medium">{problems.filter(p => p.difficulty === "Hard").length}</span>
        </div>
      </div>

      {/* Problems Table */}
      <div className="rounded-xl border border-border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-sm text-muted-foreground">
              <th className="px-6 py-4 font-medium w-12">Status</th>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Difficulty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {problems.map((problem) => (
              <tr key={problem.id} className="hover:bg-secondary/30">
                <td className="px-6 py-4">
                  {problem.solved && (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  )}
                </td>
                <td className="px-6 py-4">
                  <Link 
                    href={`/problems/${problem.slug}`}
                    className="font-medium hover:text-primary"
                  >
                    {problem.title}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className={`rounded px-2 py-1 text-xs font-medium ${difficultyColors[problem.difficulty as keyof typeof difficultyColors]}`}>
                    {problem.difficulty}
                  </span>
                </td>
                
                <td className="px-6 py-4">
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1-{problems.length} of {problems.length} problems
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
