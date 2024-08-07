import React, { useState, useEffect } from "react";
import Popup from "./popup";
// import '../utils/queue'

const MAX_QUEUE_ITEMS = 20;

const QueueVisualizer: React.FC = () => {
  const [queue, setQueue] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [inputError, setInputError] = useState<string>("");
	const [isPopupOpen, setIsPopupOpen] = useState(false);
  

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (inputError) {
      const timer = setTimeout(() => setInputError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [inputError]);

  const enqueue = (element: string) => {
    if (!element) {
      setInputError("Enter element to enqueue");
      return;
    }
    if (queue.length >= MAX_QUEUE_ITEMS) {
      setError(`Queue is full (max ${MAX_QUEUE_ITEMS} items)`);
      return;
    }
    setQueue([element, ...queue]);
    setInputValue("");
    setInputError("");
  };

  const dequeue = () => {
    if (queue.length > 0) {
      setQueue(queue.slice(0, -1));
    } else {
      setError("Queue is empty!!");
    }
  };

  const front = () => queue[0] || "Queue is empty";
  const rear = () => queue[queue.length-1] || "Queue is empty";

  const clearQueue = () => setQueue([]);

  return (
    <div className="w-full p-8 mx-auto bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl text-white font-bold mb-6 text-center">
        Queue Visualizer
      </h1>
      <div className="max-w-md mx-auto">
        <input
          type="text"
          className={`w-full mb-2 p-2 border-2 rounded mb-1 text-black bg-gray-100 ${
            inputError ? "border-red-500" : ""
          }`}
          placeholder="Enter a value to enqueue..."
          maxLength={5}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enqueue(inputValue)}
        />
        {inputError && (
          <p className="text-red-500 text-sm mb-2">{inputError}</p>
        )}
        <div className="flex flex-col mb-6">
          <div className="flex flex-row space-x-2 mb-2">
            <button
              className="flex-1 bg-purple-600 text-white font-semibold p-2 rounded hover:bg-purple-700"
              onClick={() => enqueue(inputValue)}
            >
              Enqueue
            </button>
            <button
              className="flex-1 bg-red-600 text-white font-semibold p-2 rounded hover:bg-red-700"
              onClick={dequeue}
            >
              Dequeue
            </button>
            <button
              className="flex-1 bg-yellow-600 text-white font-semibold p-2 rounded hover:bg-yellow-700"
              onClick={clearQueue}
            >
              Clear Queue
            </button>
          </div>
          <button
            onClick={() => setIsPopupOpen(true)}
            className="flex-1 max-w-md py-2 bg-blue-600 text-white font-semibold rounded "
          >
            Open Explanation & Code
          </button>
          {isPopupOpen && <Popup codeFileName={"utils/queue/queue.py"} explanationFileName={"utils/queue/queue.html"} onClose={() => setIsPopupOpen(false)} />}
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
      </div>
      

      <div className="bg-gray-700 p-4 rounded-lg">
        <p className="mb-4 text-lg font-semibold text-white">
          Front Element: <span className="text-yellow-400 mr-6">{front()}</span> 
          Rear Element: <span className="text-yellow-400 mr-6">{rear()}</span>
          Queue Length: <span className="text-yellow-400 mr-6">{queue.length || 'Queue is empty'}</span>
        </p>
        <div className="flex justify-between items-center mb-2"></div>

        <div className="flex flex-row items-center">
          {queue.length != 0 && <div className="mr-1 text-green-400">Enqueue ➔</div>}
          {queue.map((item, index) => (
            <React.Fragment key={index}>
              <div
                key={`${item}-${index}`}
                className=" border-2 text-center border-white rounded border-2 p-3 text-white  mr-1"
              >
                {item}
              </div>
              {index === queue.length - 1 && (
                <div className="ml-1 text-red-400">➔ Dequeue</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueueVisualizer;
