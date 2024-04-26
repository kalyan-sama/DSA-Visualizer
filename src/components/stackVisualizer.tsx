// src/components/StackVisualizer.tsx

import React, { useState } from "react";

const StackVisualizer: React.FC = () => {
  // Initialize an empty stack (using an array)
  const [stack, setStack] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string | "">("");

  // Function to push an element onto the stack
  const pushToStack = (element: string) => {
    setStack([...stack, element]);
  };

  // Function to pop the top element from the stack
  const popFromStack = () => {
    if (stack.length > 0) {
      const updatedStack = stack.slice(0, -1);
      setStack(updatedStack);
    }
  };

  // Function to get the top element without removing it
  const getTopElement = () => {
    if (stack.length > 0) {
      return stack[stack.length - 1];
    }
    return null; // Stack is empty
  };

  // Function to clear the entire stack
  const clearStack = () => {
    setStack([]);
  };

  return (
    <div className="max-w-md w-full p-8 mx-auto">
      <h1 className="text-xl text-white font-semibold mb-3">
        Stack Visualizer
      </h1>
      <div>
        <input
          type="text"
          className="w-full p-2 border rounded mb-3 text-black"
          placeholder="Enter a value to push..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="flex flex-row">
          <button
            className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2" 
            onClick={() => {
              if (inputValue != "") {
                pushToStack(inputValue);
                setInputValue("");
              } else return false;
            }}
          >
            Push
          </button>
          <button
            className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2" 
            onClick={popFromStack}
          >
            Pop
          </button>
          <button
            className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3" 
            onClick={clearStack}
          >
            Clear
          </button>
        </div>
      </div>
      <div>
        <p className="mb-2">Top Element: {getTopElement() || "Stack is empty"}</p>
        <ul className="list-group">
          {stack
            .slice()
            .reverse()
            .map((item, index) => (
              <li
                className=" border text-center border-gray-300 rounded border-2 p-1 "
                key={index}
              >
                {item}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default StackVisualizer;
