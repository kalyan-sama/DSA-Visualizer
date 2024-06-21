import React, { useState } from "react";

const BinarySearchVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [key, setKey] = useState<number | null>(null);
  const [low, setLow] = useState<number | null>(null);
  const [high, setHigh] = useState<number | null>(null);
  const [mid, setMid] = useState<number | null>(null);
  const [found, setFound] = useState<boolean | null>(null);
  const [step, setStep] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [isMidPhase, setIsMidPhase] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const [displayNextButton, setDisplayNextButton] = useState<boolean>(false);

  //Generate random sorter array of lenght 10
  const generateRandomSortedArray = () => {
    const length = 10; 
    const randomArray = Array.from({ length }, () =>
      Math.floor(Math.random() * 100)
    );
    randomArray.sort((a, b) => a - b); // Sort the array in ascending order
    setArray(randomArray);
    resetSearch();
  };

  //Display alert message when array is empty
  const AlertMessage = (message:string) => {
    return (
      <div
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          <p>{message}</p>
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
            onClick={()=>setErrorMessage(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
    )
  
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === null) {
        setErrorMessage(true); 
    }
    setKey(value === "" ? null : parseInt(value));
    resetSearch();
  };

  const resetSearch = () => {
    setLow(null);
    setHigh(null);
    setMid(null);
    setFound(null);
    setStep(0);
    setMessage("");
    setIsMidPhase(false);
  };

  const handleStart = () => {
    resetSearch();
    if (array.length === 0) {
      setErrorMessage(true); 
    //   setMessage("Array is empty. Please generate a random sorted array first.");
      return;
    }
    if (key === null) {
    //   setMessage("Please enter a key value.");
      return;
    }

    setDisplayNextButton(true); 
    resetSearch();
    setLow(0);
    setHigh(array.length - 1);
    setFound(null);
    setStep(1);
    setMessage(`Initializing low (L) and high (H) pointers.`);
    setIsMidPhase(true);
  };

  const handleNextStep = () => {
    if (low === null || high === null  || key === null ) return;

    if (isMidPhase) {
        const m = Math.floor((low + high) / 2);
        setMid(m);
        setMessage(
          `Calculating mid: mid = (L + H) / 2 = (${low} + ${high}) / 2 = ${m}`
        );
        setIsMidPhase(false);
      } else {
    const binarySearchStep = (low: number, high: number) => {
      if (low > high) {
        setFound(false);
        setMessage(`low (${low}) is greater than high (${high}). Key ${key} not found in the array.`);
        setDisplayNextButton(false); 
        return;
      }

      const mid = Math.floor((low + high) / 2);
      setMid(mid);
      setMessage(
        `Calculating mid: mid = (low + high) / 2 = (${low} + ${high}) / 2 = ${mid}`
      );

      if (array[mid] === key) {
        setFound(true);
        setMessage(`Key ${key} found at index ${mid}.`);
        setDisplayNextButton(false); 

      } else if (array[mid] < key) {
        setLow(mid + 1);
        setMessage(
          `Key(${key}) is greater than mid element (${array[mid]}). Moving low to mid + 1 (low = ${mid + 1}).`
        );
      } else {
        setHigh(mid - 1);
        setMessage(
          `Key(${key}) is less than mid element (${array[mid]}). Moving high to mid - 1 (high = ${mid - 1}).`
        );
      }
    };


    binarySearchStep(low, high);
    setStep(step + 1);
    setIsMidPhase(true);
  };
}

  return (
    <div className="flex flex-col items-center">

        <button
          className="bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2"
          onClick={generateRandomSortedArray}
        >
          Generate Random Sorted Array
        </button>

        <div className="flex flex-row items-center">
        <div className="mt-4 mb-4">
        <label className="block mb-2">
          Key:
          <input
            type="number"
            // value={key}
            required = {true}
            onChange={handleKeyChange}
            className="ml-2 p-2 border rounded text-black mb-2 mr-2"
          />
        </label>
      </div>
      <button
          className="bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2"
          onClick={handleStart}
          disabled={low !== null && high !== null }
        >
          Start Search
        </button>
        </div>
        {errorMessage && AlertMessage("Array is empty. Please generate a random sorted array first.")}
        
      
      <div className="flex mb-4 space-x-1">
        {array.map((value, index) => (
          <div
            key={index}
            className={`relative w-12 h-24 flex flex-col items-center justify-center ${
              low !== null && high !== null && (index < low || index > high)
                ? "opacity-50"
                : ""
            }`}
          >
            {index === mid && (
              <div className="absolute top-0 text-red-500">{key}</div>
            )}
            <div
              className={`w-12 h-12 border-2 flex items-center justify-center ${
                index === mid ? "border-yellow-700" : ""
              } ${found && index === mid ? "border-green-700" : ""} `}
            >
              {value}
            </div>
            <div className="absolute bottom-0 flex space-x-1">
              {index === low && <span className="text-blue-500">L</span>}
              {index === mid && <span className="text-green-500">M</span>}
              {index === high && <span className="text-red-500">H</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-4">
        
        {displayNextButton && <button
          className="bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2"
          onClick={handleNextStep}
          disabled={ low === null || high === null}
        >
          Next Step
        </button>}
      </div>
      <div className="mt-4">
        {message && (
          <div className="text-white-500">
            <div>Key = {key}</div>
            <div>Low = {low}</div>
            <div>High = {high}</div>
            <div className={`${mid === null ? 'hidden' : ''}`}>Mid = {mid}</div>
            <div className={`${found === true ? 'text-green-500' : found === false ? 'text-red-500' :''}`}>{message}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BinarySearchVisualizer;
