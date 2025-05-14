import { Sun, Moon } from "lucide-react";
import compilerOptions from "../data/compilerLanguages.json";
import useCompiler from "../hooks/useCompiler";

interface CompilerControlsProps {
  runCode: () => void;
  clearOutput: () => void;
}

export default function CompilerControls({ runCode, clearOutput }: CompilerControlsProps) {
  const {
    selectedLanguage,
    setSelectedLanguage,
    selectedVersion,
    setSelectedVersion,
    isLoading,
    code,
    output,
    theme,
    setTheme
  } = useCompiler();

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

      document.documentElement.classList.toggle("dark");
      document.documentElement.classList.toggle("light");
   
  }

  return (
    <div className="h-12 bg-gray-200 text-black dark:bg-gray-800 dark:text-white flex items-center px-4 ">
      <div className="flex items-center gap-4">
        <select
          title="Select Language"
          value={selectedLanguage}
          onChange={(e) => {
            setSelectedLanguage(e.target.value);
            clearOutput();
            const lang = compilerOptions.find(
              (l) => l.value === e.target.value
            );
            setSelectedVersion(lang?.versions[0]?.id || 63);
          }}
          className="bg-gray-300 text-black dark:bg-gray-700 dark:text-white p-1 rounded mr-4"
        >
          {compilerOptions.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
        <select
          title="Select Version"
          value={selectedVersion}
          onChange={(e) => setSelectedVersion(Number(e.target.value))}
          className="bg-gray-300 text-black dark:bg-gray-700 dark:text-white p-1 rounded mr-4"
        >
          {compilerOptions
            .find((lang) => lang.value === selectedLanguage)
            ?.versions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
        </select>
      </div>
      <div className="flex items-center gap-2 ml-10">
        <button className="w-10 h-10 border border-gray-900 dark:border-gray-500 flex justify-center items-center rounded" onClick={handleThemeToggle} title="Toggle Theme">
          {theme==="dark" ? <Sun />: <Moon />}
        </button>
        <button
          className="w-20 h-10 bg-blue-600 disabled:bg-gray-600 text-white flex justify-center items-center rounded"
          onClick={runCode}
          disabled={
            isLoading ||
            code.trim().length === 0 ||
            code === "// Write your code here..."
          }
        >
          {isLoading ? "Running..." : "Run"}
        </button>
      </div>
      <button
        className="w-20 h-10 ml-auto border border-gray-500 flex justify-center items-center bg-red-500 disabled:bg-gray-600 text-white rounded"
        onClick={clearOutput}
        disabled={output.trim().length === 0}
        title="Clear Output"
      >
        Clear
      </button>
    </div>
  );
}
