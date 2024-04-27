// src/App.tsx

import React, { useState } from "react";
import "./App.css";
import QueueVisualizer from "./components/QueueVisualizer";
import StackVisualizer from "./components/stackVisualizer";
import LinkedListVisualizer from "./components/LinkedListVisualizer";

enum VisualizerType {
  STACK,
  QUEUE,
  LINKEDLIST,
}

const App: React.FC = () => {
  const [currentVisualizer, setCurrentVisualizer] =
    useState<VisualizerType | null>(null);

  const handleVisualizerClick = (visualizerType: VisualizerType) => {
    setCurrentVisualizer(visualizerType);
    console.log(currentVisualizer);
  };

  const handleBackClick = () => {
    setCurrentVisualizer(null); //set the currentVisualizer to 'null' so that the visualizers list can be displayed
  };

  const renderVisualizer = () => {
    switch (currentVisualizer) {
      case VisualizerType.STACK:
        return <><StackVisualizer />
        <button className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2"  onClick={handleBackClick}>
          Back
        </button>
        </>
      case VisualizerType.QUEUE:
        return <><QueueVisualizer />
        <button className="bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2"  onClick={handleBackClick}>
          Back
        </button>
        </>
        case VisualizerType.LINKEDLIST:
          return <><LinkedListVisualizer />
          <button className="bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2"  onClick={handleBackClick}>
            Back
          </button>
          </>
      default:
        // Render the list of visualizers (cards)
        return (
          <div className="max-w-md w-full p-8 mx-auto">
            <h1 className="text-xl text-white font-semibold mb-3">
              Choose a Visualizer:
            </h1>
            <div className="flex flex-col">

              <button
                className="flex-1 max-w-xs bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2	text-center" 
                onClick={() => handleVisualizerClick(VisualizerType.STACK)}
              >
                Stack Visualizer
              </button>

              <button
                className="flex-1 max-w-xs bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2 text-center" 
                onClick={() => handleVisualizerClick(VisualizerType.QUEUE)}
              >
                Queue Visualizer
              </button>

              <button
                className="flex-1 max-w-xs bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2 text-center" 
                onClick={() => handleVisualizerClick(VisualizerType.LINKEDLIST)}
              >
                Linked List Visualizer
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="App">
      {renderVisualizer()}

    </div>
  );
};

export default App;

