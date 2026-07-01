import Link from "next/link";
import { Terminal, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 md:flex-row lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Terminal className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">CompileX</span>
          </Link>

          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            A modern online judge for competitive programming featuring secure
            Docker-based code execution, contests, and leaderboards.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/problems"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Problems
          </Link>

          <Link
            href="/contests"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Contests
          </Link>

          <Link
            href="/submissions"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Submissions
          </Link>

          <Link
            href="https://github.com/mohitjaint/compileX"
            target="_blank"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            GitHub
          </Link>
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} CompileX • Built by Mohit Kumar Jaint
      </div>
    </footer>
  );
}