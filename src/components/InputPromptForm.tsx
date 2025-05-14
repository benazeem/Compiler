import useCompiler from "../hooks/useCompiler";

interface InputPromptFormProps {
  handleSubmitInputs: () => void;
}

export default function InputPromptForm({
  handleSubmitInputs,
}: InputPromptFormProps) {

   const {prompts, inputFields, setInputFields} = useCompiler();

  return (
    <div className="p-4 bg-white text-black dark:bg-gray-800 dark:text-white w-full h-full overflow-scroll no-scrollbar">
      <p className="mb-2">Enter {inputFields.length} input(s):</p>
      {inputFields.map((val, idx) => (
        <div key={idx} className="mb-2">
          <label className="block mb-1 font-semibold text-black dark:text-gray-300">
            {prompts[idx] || `Input ${idx + 1}:`}
          </label>
          <input
            title="Custom Input field"
            type="text"
            value={val}
            onChange={(e) => {
              const arr = [...inputFields];
              arr[idx] = e.target.value;
              setInputFields(arr);
            }}
            className="w-full p-2 bg-gray-200 text-black dark:bg-gray-700 dark:text-white rounded"
          />
        </div>
      ))}
      <button onClick={handleSubmitInputs} className="mt-4 dark:bg-blue-600 bg-amber-100 px-4 py-2 rounded ">
        Submit & Execute
      </button>
    </div>
  );
}
