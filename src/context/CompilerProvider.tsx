import { useState, type ReactNode } from "react";
import compilerOptions from "../data/compilerLanguages.json";
import CompilerContext from "./CompilerContext";

const CompilerProvider = ({ children }: { children: ReactNode }) => {
  const [code, setCode] = useState<string>("// Write your code here...");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("javaScript");
  const [selectedVersion, setSelectedVersion] = useState<number>(
    compilerOptions.find((lang) => lang.value === "javascript")?.versions[0]?.id || 63
  );
  const [inputFields, setInputFields] = useState<string[]>([]);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [inputRequired, setInputRequired] = useState<boolean>(false);
  const [output, setOutput] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>("dark");

  return (
    <CompilerContext.Provider
      value={{
        code,
        setCode,
        selectedLanguage,
        setSelectedLanguage,
        selectedVersion,
        setSelectedVersion,
        inputFields,
        setInputFields,
        prompts,
        setPrompts,
        inputRequired,
        setInputRequired,
        output,
        setOutput,
        isError,
        setIsError,
        isLoading,
        setIsLoading,
        theme,
        setTheme,
      }}
    >
      {children}
    </CompilerContext.Provider>
  );
};

export  default CompilerProvider;