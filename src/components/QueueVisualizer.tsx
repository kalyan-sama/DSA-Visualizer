// src/components/QueueVisualizer.tsx

import React, { useState } from "react";

const QueueVisualizer: React.FC = () => {
  // Initialize an empty queue (using an array)
  const [queue, setQueue] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>(""); // Input value for enqueue

  // Function to enqueue an element
  const enqueue = (element: string) => {
    setQueue([...queue, element]);
  };

  // Function to dequeue the front element
  const dequeue = () => {
    if (queue.length > 0) {
      const updatedQueue = queue.slice(1); // Remove the front element
      setQueue(updatedQueue);
    }
  };

  // Function to get the front element without removing it
  const front = () => {
    if (queue.length > 0) {
      return queue[0];
    }
    return null; // Queue is empty
  };

  // Function to clear the entire queue
  const clearQueue = () => {
    setQueue([]);
  };

  return (
    <div className="max-w-md w-full p-8 mx-auto">
      <h1 className="text-xl text-white font-semibold mb-3">
        Queue Visualizer
      </h1>
      <div>
        <input
          type="text"
          className="w-full p-2 border rounded mb-3 text-black"
          placeholder="Enter a value to add to the queue..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="flex flex-row">
          <button
            className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2" 
            onClick={() => {
              if (inputValue != "") {
                enqueue(inputValue);
                setInputValue("");
              } else return false;
            }}
          >
            Enqueue
          </button>
          <button
            className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2" 
            onClick={dequeue}
          >
            Dequeue
          </button>
          <button
            className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3" 
            onClick={clearQueue}
          >
            Clear Queue
          </button>
        </div>
      </div>
      <div>
        <p>Front Element: {front() || "Queue is empty"}</p>
        <ul className="flex flex-wrap">
          {queue.map((item, index) => (
            <li
              className=" border text-center border-gray-300 rounded border-2 p-3"
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

export default QueueVisualizer;
