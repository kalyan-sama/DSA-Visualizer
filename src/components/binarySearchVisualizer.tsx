import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Popup from "./popup";

const MAX_ARRAY_SIZE = 15;

const BinarySearchVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [key, setKey] = useState<number | null>(null);
  const [low, setLow] = useState<number | null>(null);
  const [high, setHigh] = useState<number | null>(null);
  const [mid, setMid] = useState<number | null>(null);
  const [found, setFound] = useState<boolean | null>(null);
  const [step, setStep] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [keyError, setKeyError] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [midDisplayed, setMidDisplayed] = useState<boolean>(false);
	const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    generateRandomSortedArray(MAX_ARRAY_SIZE);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying && isSearching) {
      timer = setTimeout(handleNextStep, 1000);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, isSearching, step]);

  const generateRandomSortedArray = (size: number) => {
    const randomArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100)).sort((a, b) => a - b);
    setArray(randomArray);
    resetSearch();
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKey(value === "" ? null : parseInt(value));
    setKeyError("");
    resetSearch();
  };

  const resetSearch = () => {
    setLow(null);
    setHigh(null);
    setMid(null);
    setFound(null);
    setStep(0);
    setMessage("");
    setIsSearching(false);
    setIsAutoPlaying(false);
    setMidDisplayed(false);
  };

  const handleStart = () => {
    if (key === null) {
      setKeyError("Please enter a Key");
      return;
    }
    resetSearch();
    setLow(0);
    setHigh(array.length - 1);
    setStep(1);
    setMessage(`Binary Search Started. Searching for ${key}...`);
    setIsSearching(true);
  };

  const handleNextStep = () => {
    if (low === null || high === null || key === null || !isSearching) return;

    if (!midDisplayed && low <= high) {
      const newMid = Math.floor((low + high) / 2);
      setMid(newMid);
      setMidDisplayed(true);
      setMessage( `Calculating mid index: mid = (L + H) / 2 = (${low} + ${high}) / 2 = ${mid}`);
    } else {
      if (array[mid!] === key) {
        setFound(true);
        setMessage(`Key ${key} found at index ${mid}.`);
        setIsSearching(false);
        setIsAutoPlaying(false);
      } else if (array[mid!] < key) {
        setLow(mid! + 1);
        setMessage(`Key (${key}) is greater than mid element (${array[mid!]}). Moving low to mid + 1 (low = ${mid! + 1}).`);
      } else {
        setHigh(mid! - 1);
        setMessage(`Key (${key}) is less than mid element (${array[mid!]}). Moving high to mid - 1 (high = ${mid! - 1}).`);
      }

      if (low > high) {
        setFound(false);
        setMessage(`low (${low}) is greater than high (${high}). Key ${key} not found in the array.`);
        setIsSearching(false);
        setIsAutoPlaying(false);
      }

      setMidDisplayed(false);
    }

    setStep(step + 1);
  };

  return (
    <div className="h-full bg-gray-900 text-gray-100 p-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-xl font-bold mb-8 text-center text-white">Binary Search Visualizer</h1>
        
        {/* buttons section */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <button className="bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2" onClick={() => {generateRandomSortedArray(MAX_ARRAY_SIZE)}}>
            New Array
          </button>

          <div className="relative">
            <input
              type="number"
              onChange={handleKeyChange}
              className={`p-2 border-2 rounded-lg text-white w-24 bg-gray-800 ${keyError ? "border-red-500" : "border-white"}`}
              placeholder="Key"
            />
            {keyError && <div className="absolute left-0 top-full mt-1 text-red-500 text-xs">{keyError}</div>}
          </div>

          <button className="bg-green-600 text-white font-semibold px-3 p-2 rounded hover:bg-green-700 mb-3 mr-2" onClick={handleStart} disabled={isSearching}>
            Start
          </button>

          <button className="bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2" onClick={handleNextStep} disabled={!isSearching || found !== null}>
            Next Step
          </button>

          <button
            className={`text-white font-semibold px-3 p-2 rounded mb-3 mr-2 ${isAutoPlaying ? "bg-red-600" : "bg-yellow-600"}`}
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            disabled={!isSearching || found !== null}
          >
            {isAutoPlaying ? "Pause" : "Auto"}
          </button>

          <button
						onClick={() => setIsPopupOpen(true)}
						className="py-2 bg-blue-600 px-2 text-white font-semibold rounded mb-3"
					>
						Open Explanation & Code
					</button>
					{isPopupOpen && <Popup codeFileName={"utils/binary search/binary_search.py"} explanationFileName={"utils/binary search/binary_search.html"} onClose={() => setIsPopupOpen(false)} />}

        </div>
        {/* End of buttons Section */}

        {/* Array display section */}

        <div className="mb-2 bg-gray-800 p-6 rounded-lg">
          <div className="flex justify-center space-x-2 mb-8">
            {array.map((value, index) => (
              <div key={index} className="relative w-12 flex flex-col items-center">
                <div
                  className={`w-12 h-12 border-2 flex items-center justify-center text-lg font-semibold rounded-lg
                    ${
                        found && index === mid
                          ? "border-green-500 bg-green-900 text-green-100"
                          : index === mid
                          ? "border-yellow-500 bg-yellow-900 text-yellow-100"
                          : index === low || index === high
                          ? "border-blue-500"
                          : ""
                      }
                    ${(low !== null && high !== null && (index < low || index > high)) ? "opacity-50" : ""}
                  `}
                >
                  {value}
                </div>
                <div className="text-xs text-gray-400 mt-1">{index}</div>
                <div className="absolute top-full mt-2 flex space-x-1 text-sm font-bold">
                  {index === low && (
                    <motion.span className="text-blue-400" initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                      L
                    </motion.span>
                  )}
                  {index === mid && (
                    <motion.span className="text-yellow-400" initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                      M
                    </motion.span>
                  )}
                  {index === high && (
                    <motion.span className="text-red-400" initial={{ x: 100 }} animate={{ x: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                      H
                    </motion.span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className={`text-xl font-bold mt-2 ${found === true ? "text-green-400" : found === false ? "text-red-400" : ""}`}>
            {found === true ? `Key found at index: ${mid}` : found === false ? "Key not found" : ""}
          </p>
        </div>

        {/* End of Array display section */}

        {/* Steps Section */}

        <div className="bg-gray-800 p-3 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 underline">Search Steps:</h2>
          
          <div>
                <p><strong>Key:</strong> {key !== null ? key : 'Not set'}</p>
          </div>  
          <div className={`mb-2 text-lg ${step === 0 ? "hidden" : ""}`}>
            <strong>Step-{step}:</strong> {message}
          </div> 
          <div className="flex flex-row">
                    <p className="mr-4"><strong>Low:</strong> {low !== null ? low : 'Not set'}</p>
                    <p className="mr-4"><strong>High:</strong> {high !== null ? high : 'Not set'}</p>
                    <p className="mr-4"><strong>Mid:</strong> {mid !== null ? mid : 'Not set'}</p>
                </div>
        </div>

        {/*End of Steps Section */}

      </div>
    </div>
  );
};

export default BinarySearchVisualizer;