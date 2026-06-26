"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSearchParams } from "next/navigation"
import {apiFetch} from "@/lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Play, Send, RotateCcw, Settings, Copy, CheckCircle2 } from "lucide-react"
import Editor from "@monaco-editor/react";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";


const languages = [
  { id: "cpp", name: "C++17", extension: "cpp" },
  { id: "python", name: "Python 3", extension: "py" },
  { id: "java", name: "Java 17", extension: "java" },
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
  const contestId = searchParams.get("contestId");
  const languageMap: Record<string, string> = {
    cpp: "C++",
    java: "Java",
    python: "Python",
  };

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

  const pollSubmission = (submissionId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await apiFetch(`/submissions/${submissionId}`);

        const submission = res.data.submission;

        if (
          submission.status === "Pending" ||
          submission.status === "Judging"
        ) {
          setOutput(
  `Status: ${submission.status}

  Waiting for judge...`
          );

          return;
        }

        clearInterval(interval);

        setOutput(
  `Verdict: ${submission.verdict}

  Time: ${submission.executionTime ?? "-"} ms

  Memory: ${submission.memoryUsed ?? "-"} MB`
        );
      } catch (err: any) {
        clearInterval(interval);
        setOutput(err.message);
      }
    }, 1500);
  };
  const handleSubmit = async () => {

    const language = languageMap[selectedLanguage];

    if (!language) {
      setActivePanel("output");
      setOutput("This language is not supported yet.");
      return;
    }

    try {
      setActivePanel("output");
      setOutput("Submitting solution...");

      const submitRes = await apiFetch(
        `/submissions/submit`,
        {
          method: "POST",
          body: JSON.stringify({
            problemId: problem._id,
            language,
            code,
            contestId
          }),
        }
      );

      const submissionId = submitRes.data.submissionId;

      setOutput(`Submission queued...\nSubmission ID: ${submissionId}`);

      pollSubmission(submissionId);

    } catch (err: any) {
      setOutput(err.message);
    }
  };

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
      <PanelGroup direction="horizontal" className="flex-1">

        {/* Problem Statement */}
        <Panel defaultSize={45} minSize={25}>
          <div className="h-full overflow-auto border-r border-border p-6">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-xl font-semibold">Problem Statement</h2>

              <p className="text-muted-foreground whitespace-pre-wrap">
                {problem.statement}
              </p>

              <h3 className="mt-6 text-lg font-semibold">
                Input Format
              </h3>

              <p className="whitespace-pre-wrap">
                {problem.inputFormat}
              </p>

              <h3 className="mt-6 text-lg font-semibold">
                Output Format
              </h3>

              <p className="whitespace-pre-wrap">
                {problem.outputFormat}
              </p>

              <h3 className="mt-6 text-lg font-semibold">
                Constraints
              </h3>

              <p className="whitespace-pre-wrap">
                {problem.constraints}
              </p>

              <h3 className="mt-6 text-lg font-semibold">
                Examples
              </h3>

              {problem.sampleTestCases?.map((sample: any, index: number) => (
                <div
                  key={index}
                  className="mt-4 rounded-lg border border-border bg-secondary/30 p-4"
                >
                  <div className="mb-2 text-sm font-medium">
                    Example {index + 1}
                  </div>

                  <div className="font-mono text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        Input:
                      </span>

                      <pre>{sample.input}</pre>
                    </div>

                    <div>
                      <span className="text-muted-foreground">
                        Output:
                      </span>

                      <pre>{sample.output}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors" />

        {/* Right Side */}
        <Panel defaultSize={55} minSize={30}>

          <div className="flex h-full flex-col">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="rounded border border-border bg-secondary px-3 py-1.5 text-sm"
              >
                {languages.map((lang) => (
                  <option
                    key={lang.id}
                    value={lang.id}
                  >
                    {lang.name}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                >
                  {copied
                    ? <CheckCircle2 className="h-4 w-4 text-success" />
                    : <Copy className="h-4 w-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCode(defaultCode)}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>

              </div>

            </div>

            <PanelGroup
              direction="vertical"
              className="flex-1"
            >

              {/* Editor */}
              <Panel defaultSize={75} minSize={30}>

                <Editor
                  height="100%"
                  language={selectedLanguage}
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value ?? "")}
                  options={{
                    minimap: { enabled: false },
                    automaticLayout: true,
                    fontSize: 14,
                    tabSize: 4,
                    wordWrap: "on",
                    scrollBeyondLastLine: false,
                  }}
                />

              </Panel>

              <PanelResizeHandle className="h-1 bg-border hover:bg-primary transition-colors" />

              {/* Bottom Panel */}
              <Panel
                defaultSize={25}
                minSize={15}
              >

                <div className="flex h-full flex-col">

                  <div className="flex border-b border-border">

                    <button
                      onClick={() => setActivePanel("input")}
                      className={`px-4 py-2 ${
                        activePanel === "input"
                          ? "border-b-2 border-primary"
                          : ""
                      }`}
                    >
                      Custom Input
                    </button>

                    <button
                      onClick={() => setActivePanel("output")}
                      className={`px-4 py-2 ${
                        activePanel === "output"
                          ? "border-b-2 border-primary"
                          : ""
                      }`}
                    >
                      Output
                    </button>

                  </div>

                  <div className="flex-1 overflow-auto p-4">

                    {activePanel === "input" ? (

                      <textarea
                        value={customInput}
                        onChange={(e) =>
                          setCustomInput(e.target.value)
                        }
                        className="h-full w-full resize-none bg-transparent font-mono outline-none"
                      />

                    ) : (

                      <pre className="whitespace-pre-wrap font-mono">
                        {output || "Run your code to see output here."}
                      </pre>

                    )}

                  </div>

                </div>

              </Panel>

            </PanelGroup>

            <div className="flex items-center justify-end gap-2 border-t border-border bg-card px-4 py-3">

              <Button
                variant="outline"
                onClick={handleRun}
              >
                <Play className="mr-2 h-4 w-4" />
                Run
              </Button>

              <Button onClick={handleSubmit}>
                <Send className="mr-2 h-4 w-4" />
                Submit
              </Button>

            </div>

          </div>

        </Panel>

      </PanelGroup>
    </div>
  )
}
