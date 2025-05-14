import './App.css'
import CompilerTool from './components/Compiler'
import CompilerProvider from './context/CompilerProvider'

function App() {

  return (
    <>
    <CompilerProvider>
     <CompilerTool />
     </CompilerProvider>
    </>
  )
}

export default App
