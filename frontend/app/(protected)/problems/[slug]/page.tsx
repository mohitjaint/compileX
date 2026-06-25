"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSearchParams } from "next/navigation"
import {apiFetch} from "@/lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Play, Send, RotateCcw, Settings, Copy, CheckCircle2 } from "lucide-react"


const languages = [
  { id: "cpp", name: "C++17", extension: "cpp" },
  { id: "python", name: "Python 3", extension: "py" },
  { id: "java", name: "Java 17", extension: "java" },
  { id: "javascript", name: "JavaScript", extension: "js" },
  { id: "go", name: "Go", extension: "go" },
  { id: "rust", name: "Rust", extension: "rs" },
]

const defaultCode = `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Your code here
    
    return 0;
}`

export default function ProblemPage() {
  const { slug } = useParams<{ slug: string }>()
  const [problem,setProblem]=useState<any>(null)
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("cpp")
  const [code, setCode] = useState(defaultCode)
  const [customInput, setCustomInput] = useState("")
  const [output, setOutput] = useState("")
  const [activePanel, setActivePanel] = useState<"input" | "output">("input")
  const [copied, setCopied] = useState(false)
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/problems";

  useEffect(
    ()=>{
        (async()=>{
            try{setLoading(true);
                const res=await apiFetch(`/problems/${slug}`);
                setProblem(res.data)
                console.log(res.data)
            }
            catch(e:any){
                setError(e.message)
            }
            finally{
                setLoading(false)
            }
        }
    )()},[slug])


  if(error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>

  if(!problem) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRun = () => {
    setActivePanel("output")
    setOutput("Running test cases...\n\nTest Case 1: Passed\nTest Case 2: Passed\n\nAll test cases passed!")
  }

  const handleSubmit = () => {
    setActivePanel("output")
    setOutput("Submitting solution...\n\nJudging...\n\nVerdict: Accepted\nTime: 12ms\nMemory: 8.2 MB")
  }

  return (
    <div className="flex h-[calc(100vh-65px)] flex-col">
      {/* Problem Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={returnTo}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Problems
            </Link>
          </Button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <h1 className="font-semibold">{problem.title}</h1>
            <span className="rounded bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
              {problem.difficulty}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Time: {problem.timelimit+" ms"}</span>
          <span className="text-border">|</span>
          <span>Memory: {problem.memorylimit+" MB"}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Problem Statement */}
        <div className="w-1/2 overflow-auto border-r border-border p-6">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-xl font-semibold">Problem Statement</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{problem.statement}</p>
            <h3 className="mt-6 text-lg font-semibold">Input Format</h3><p className="whitespace-pre-wrap">{problem.inputFormat}</p>
            <h3 className="mt-6 text-lg font-semibold">Output Format</h3><p className="whitespace-pre-wrap">{problem.outputFormat}</p>
            <h3 className="mt-6 text-lg font-semibold">Constraints</h3><p className="whitespace-pre-wrap">{problem.constraints}</p>
            <h3 className="mt-6 text-lg font-semibold">Examples</h3>
            {problem.sampleTestCases?.map((sample:any,index:number)=>(<div key={index} className="mt-4 rounded-lg border border-border bg-secondary/30 p-4"><div className="mb-2 text-sm font-medium">Example {index+1}</div><div className="font-mono text-sm"><div><span className="text-muted-foreground">Input:</span><pre>{sample.input}</pre></div><div><span className="text-muted-foreground">Output:</span><pre>{sample.output}</pre></div></div></div>))}
</div>
        </div>

        {/* Code Editor */}
        <div className="flex w-1/2 flex-col">
          {/* Editor Header */}
          <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="rounded border border-border bg-secondary px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCode(defaultCode)}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Code Area */}
          <div className="flex-1 overflow-hidden">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-full w-full resize-none bg-background p-4 font-mono text-sm focus:outline-none"
              spellCheck={false}
            />
          </div>

          {/* Input/Output Panel */}
          <div className="h-48 border-t border-border">
            <div className="flex border-b border-border">
              <button
                onClick={() => setActivePanel("input")}
                className={`px-4 py-2 text-sm font-medium ${
                  activePanel === "input" ? "border-b-2 border-primary text-foreground" : "text-muted-foreground"
                }`}
              >
                Custom Input
              </button>
              <button
                onClick={() => setActivePanel("output")}
                className={`px-4 py-2 text-sm font-medium ${
                  activePanel === "output" ? "border-b-2 border-primary text-foreground" : "text-muted-foreground"
                }`}
              >
                Output
              </button>
            </div>
            <div className="h-[calc(100%-41px)] overflow-auto p-4">
              {activePanel === "input" ? (
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter your custom input here..."
                  className="h-full w-full resize-none bg-transparent font-mono text-sm focus:outline-none"
                />
              ) : (
                <pre className="font-mono text-sm text-muted-foreground whitespace-pre-wrap">
                  {output || "Run your code to see output here."}
                </pre>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t border-border bg-card px-4 py-3">
            <div className="text-sm text-muted-foreground">
              
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRun}>
                <Play className="mr-2 h-4 w-4" />
                Run
              </Button>
              <Button onClick={handleSubmit}>
                <Send className="mr-2 h-4 w-4" />
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
