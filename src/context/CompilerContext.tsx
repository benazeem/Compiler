import { createContext } from "react";

export interface CompilerContextProps {
  code: string;
  setCode: (code: string) => void;

  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;

  selectedVersion: number;
  setSelectedVersion: (version: number) => void;

  inputFields: string[];
  setInputFields: (fields: string[]) => void;

  prompts: string[];
  setPrompts: (prompts: string[]) => void;

  inputRequired: boolean;
  setInputRequired: (required: boolean) => void;

  output: string;
  setOutput: (output: string) => void;

  isError: boolean;
  setIsError: (error: boolean) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  theme: string;
  setTheme: (theme: string) => void;
}

 const CompilerContext = createContext<CompilerContextProps | undefined>(undefined);


export default CompilerContext;