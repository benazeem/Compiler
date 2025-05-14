import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import useCompiler from "../hooks/useCompiler";



export default function OutputPanel() {

  const {output, isError, isLoading} = useCompiler();

  return (
    <div className="flex-1 p-4 bg-white  text-black dark:bg-neutral-800 dark:text-white overflow-auto text-left">
      <pre className={isError ? "dark:text-red-400 text-red-800" : "dark:text-green-300 text-black"}>
        {output.trim().length > 0 && output}
        <p className="text-gray-500">
          {output !== "Submission failed." &&
            output.trim().length > 0 &&
            "\n\n\n  <--Code Executed!-->\n\n\n"}
        </p>
        {isLoading && (
          <DotLottieReact
            src="https://lottie.host/82d23131-50e7-490a-8fe2-49c2f901d347/V3uNmzp1jn.lottie"
            className="w-full h-full "
            loop
            autoplay
          />
        )}
      </pre>
    </div>
  );
}
