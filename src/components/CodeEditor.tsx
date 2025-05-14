import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import useCompiler from "../hooks/useCompiler";
import { useRef } from "react";



export default function CodeEditor() {
    const {code,setCode,selectedLanguage, theme} = useCompiler();
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    const handleEditorMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor; // Use onMount to set the editor reference
  };

  return (
    <Editor
      key={selectedLanguage}
      theme={`vs-${theme}`}
      language={selectedLanguage.toLowerCase()}
      value={code}
      onMount={handleEditorMount}
      onChange={(val) => setCode(val ?? "")}
      options={{ automaticLayout: true, minimap: { enabled: false } }}
    />
  );
}
