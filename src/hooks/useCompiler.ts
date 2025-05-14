import {useContext} from "react";
import {type CompilerContextProps} from "../context/CompilerContext";
import CompilerContext from "../context/CompilerContext";

 const useCompiler = (): CompilerContextProps => {
  const context = useContext(CompilerContext);
  if (!context) throw new Error("useCompiler must be used within CompilerProvider");
  return context;
};

export default useCompiler;