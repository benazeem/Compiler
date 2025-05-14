import {useCallback } from "react";
import { submitCode, getSubmissionResult } from "../services/CompileCodeUtil";
import CompilerControls from "./CompilerControls";
import CodeEditor from "./CodeEditor";
import InputPromptForm from "./InputPromptForm";
import OutputPanel from "./OutputPanel";
import useCompiler from "../hooks/useCompiler";

// Patterns to detect input calls per language
const languageInputPatterns: Record<string, RegExp> = {
  Python: /input\s*\(\s*['"`](.+?)['"`]\s*\)/g,
  JavaScript: /prompt\s*\(\s*['"`](.+?)['"`]\s*\)/g,
  TypeScript: /prompt\s*\(\s*['"`](.+?)['"`]\s*\)/g,
  Java: /System\.out\.print(?:ln)?\s*\(\s*["'](.+?)["']\s*\)/g,
  C: /printf\s*\(\s*["'](.+?)["']\s*\)/g,
  "C++": /cout\s*<<\s*["'](.+?)["']/g,
  "C#": /Console\.Write(?:Line)?\s*\(\s*["'](.+?)["']\s*\)/g,
  PHP: /readline\s*\(\s*["'](.+?)["']\s*\)/g,
  Ruby: /gets\s*\.chomp\s*#?\s*["'](.+?)["']?/g,
  Swift: /readLine\s*\(\s*\)/g,
  Go: /fmt\.Scan(?:ln|f)?\s*\(/g,
  Rust: /io::stdin\(\)\.read_line\(&mut\s*[\w\d_]+\)\s*(?:\.expect\([^)]+\))?/g,
  Kotlin: /readLine\s*\(\)\s*\?\s*\.toIntOrNull\(\)/g,
  Scala: /readLine\s*\(\s*["'](.+?)["']\s*\)/g,
  "Objective-C": /fgets\s*\(\s*[a-zA-Z0-9_]+\s*,\s*[^,]+,\s*stdin\s*\)\s*;?/g,
  Perl: /<STDIN>|<>|\$_[^=]*=\s*<[^>]+>|\b(?:readline|getc)\b/g,
  "Visual Basic.Net": /Console\.Write(?:Line)?\s*\(\s*["'](.+?)["']\s*\)/g,
  SQL: /--\s*PROMPT:\s*(.+)/g, // use comment as pseudo prompt
};
// Extract prompt strings from code for Python-style input("...")
function extractPrompts(code: string, language: string): string[] {
  const prompts: string[] = [];

  const promptRegEx: Record<string, RegExp> = {
    Python: /input\s*\(\s*['"`](.+?)['"`]\s*\)/g,
    JavaScript: /prompt\s*\(\s*['"`](.+?)['"`]\s*\)/g,
    TypeScript: /prompt\s*\(\s*['"`](.+?)['"`]\s*\)/g,
    Java: /System\.out\.print(?:ln)?\s*\(\s*["'](.+?)["']\s*\)/g,
    C: /printf\s*\(\s*["'](.+?)["']\s*\)/g,
    "C++": /cout\s*<<\s*["'](.+?)["']/g,
    "C#": /Console\.Write(?:Line)?\s*\(\s*["'](.+?)["']\s*\)/g,
    PHP: /readline\s*\(\s*["'](.+?)["']\s*\)/g,
    Ruby: /gets\s*\.chomp\s*#?\s*["'](.+?)["']?/g,
    Swift: /print\s*\(\s*"(.*?)"\s*\)/g,
    Go: /fmt\.(?:Print)\s*\(\s*["'`](.*?)["'`]\s*\)/g,
    Rust: /println!\s*\(\s*["'](.+?)["']/g,
    Kotlin: /print\s*\(\s*"(.*?)"\s*\)/g,
    Scala: /readLine\s*\(\s*["'](.+?)["']\s*\)/g,
    "Objective-C": /printf\s*\(\s*"([^"]+)"\s*\)\s*;?/g,
    Perl: /<>;|print\s*\(?\s*["'](.+?)["']\s*\)?/g,
    "Visual Basic.Net": /Console\.Write(?:Line)?\s*\(\s*["'](.+?)["']\s*\)/g,
    SQL: /--\s*PROMPT:\s*(.+)/g, // use comment as pseudo prompt
  };
  const regex = promptRegEx[language];

  if (!regex) return [];

  let match: RegExpExecArray | null;
  while ((match = regex.exec(code)) !== null) {
    if (match[1]) prompts.push(match[1]);
  }

  return prompts;
}

function splitByPrompts(
  output: string,
  prompts: string[],
  merged: string[]
): string {
  let result = output;
  prompts.forEach((prompt, index) => {
    result = result.replace(new RegExp(prompt, "g"), `${merged[index]},\n`);
  });

  return result;
}

export default function CompilerTool() {
  

   const { code,
        selectedLanguage,
        selectedVersion,
        inputFields,
        setInputFields,
        prompts,
        setPrompts,
        inputRequired,
        setInputRequired,
        setOutput,
        setIsError,
        setIsLoading} = useCompiler();


  // Detect input call locations (for counting)
  const findInputMatches = useCallback(() => {
    const pattern = languageInputPatterns[selectedLanguage.toUpperCase()];
    if (!pattern) return [];
    const matches: number[] = [];
    let m: RegExpExecArray | null;
    const re = new RegExp(pattern);
    while ((m = re.exec(code)) !== null) {
      matches.push(m.index);
    }
    return matches;
  }, [code, selectedLanguage]);

  

  // Core run logic
  const runFinalCode = async (stdin: string) => {
    setIsLoading(true);
    setIsError(false);
    setOutput("");
    try {
      const token = await submitCode({
        language_id: selectedVersion,
        source_code: code,
        stdin,
      });
      const interval = setInterval(async () => {
        const res = await getSubmissionResult(token);
        if (res.status.id > 2) {
          clearInterval(interval);
          setIsLoading(false);
          // Determine raw output or error
          let raw = res.stdout || res.compile_output || "";
          if (res.status.id !== 3) {
            setIsError(true);
            raw =
              res.stderr ||
              res.compile_output ||
              res.stdout ||
              res.status.description ||
              res.message ||
              raw;
          }

          const rest = raw.split("\n");

          // If prompts exist, interleave
          if (prompts.length > 0 && inputFields.length <= prompts.length) {
            const merged: string[] = [];
            // iterate prompts and inputs
            inputFields.forEach((p, idx) => {
              merged.push(`${prompts[idx]}- ${p}`);
            });

            merged.push(...rest);
            const cleanOutput = splitByPrompts(rest[0], prompts, merged);
            setOutput(cleanOutput);
            setInputFields([]);
          } else {
            setOutput(raw);
            setInputFields([]);
          }
        }
      }, 1000);
    } catch {
      setIsLoading(false);
      setIsError(true);
      setOutput("Submission failed.");
      setInputFields([]);
    }
  };

  // When Run clicked
  const handleRun = () => {
    const matches = findInputMatches();
    setInputFields([]);
    const extracted = extractPrompts(code, selectedLanguage);
    if (matches.length > 0) {
      setPrompts(extracted);
      setInputFields(Array(matches.length).fill(""));
      setInputRequired(true);
      setIsError(false);
      setOutput("");
    } else {
      setPrompts([]);
      runFinalCode("");
    }
  };

  // After user enters inputs and clicks submit
  const handleSubmitInputs = () => {
    setInputRequired(false);
    const input = inputFields.join("\n");
    runFinalCode(input);
  };

  // Clear output
  const handleClear = () => {
    setOutput("");
    setIsError(false);
    setInputRequired(false);
    setInputFields([]);
  };

  return (
    <main className="flex flex-col min-h-screen overflow-hidden">
      <CompilerControls
        runCode={handleRun}
        clearOutput={handleClear}
      />

      <section className="flex flex-grow overflow-hidden">
        <div className="w-1/2 border-r border-gray-700">
          <CodeEditor
          />
        </div>

        <div className="w-1/2 flex flex-col">
          {inputRequired ? (
            <InputPromptForm
              handleSubmitInputs={handleSubmitInputs}
            />
          ) : (
            <OutputPanel />
          )}
        </div>
      </section>
    </main>
  );
}
