import React, { useState } from "react";
import "./App.css";
import QueueVisualizer from "./components/QueueVisualizer";
import StackVisualizer from "./components/stackVisualizer";
import LinkedListVisualizer from "./components/LinkedListVisualizer";
import MergeSortVisualizer from "./components/mergeSortVisualizer";
import BinarySearchVisualizer from "./components/binarySearchVisualizer";
import BST from "./components/BST";


enum VisualizerType {
  STACK,
  QUEUE,
  LINKEDLIST,
  MERGESORT,
  BINARYSEARCH,
  BST,
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
        return (
          <>
            <StackVisualizer />
            <button
              className="bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 m-3"
              onClick={handleBackClick}
            >
              Back
            </button>
          </>
        );

      case VisualizerType.QUEUE:
        return (
          <>
            <QueueVisualizer />
            <button
              className="bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 m-3"
              onClick={handleBackClick}
            >
              Back
            </button>
          </>
        );

      case VisualizerType.LINKEDLIST:
        return (
          <>
            <LinkedListVisualizer />
            <button
              className="bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 m-3"
              onClick={handleBackClick}
            >
              Back
            </button>
          </>
        );

      case VisualizerType.MERGESORT:
        return (
          <>
            <MergeSortVisualizer />
            <button
              className="bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 m-3"
              onClick={handleBackClick}
            >
              Back
            </button>
          </>
        );

      case VisualizerType.BINARYSEARCH:
        return (
          <>
            <BinarySearchVisualizer />
            <button
              className="bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 m-3"
              onClick={handleBackClick}
            >
              Back
            </button>
          </>
        );

        case VisualizerType.BST:
        return (
          <>
            <BST />
            <button
              className="bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 m-3"
              onClick={handleBackClick}
            >
              Back
            </button>
          </>
        );
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

              <button
                className="flex-1 max-w-xs bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2 text-center"
                onClick={() => handleVisualizerClick(VisualizerType.MERGESORT)}
              >
                Merge Sort Visualizer
              </button>

              <button
                className="flex-1 max-w-xs bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2 text-center"
                onClick={() => handleVisualizerClick(VisualizerType.BINARYSEARCH)}
              >
                Binary Search Visualizer
              </button>
              <button
                className="flex-1 max-w-xs bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2 text-center"
                onClick={() => handleVisualizerClick(VisualizerType.BST)}
              >
                Binary Search Tree Visualizer
              </button>
            </div>
          </div>
        );
    }
  };

  return <div className="h-full w-full flex flex-col items-center justify-center bg-gray-900">{renderVisualizer()}</div>;
};

export default App;