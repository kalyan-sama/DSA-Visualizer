import React, { useState } from "react";
import "./App.css";
import QueueVisualizer from "./components/QueueVisualizer";
import StackVisualizer from "./components/stackVisualizer";
import LinkedListVisualizer from "./components/LinkedListVisualizer";
import MergeSortVisualizer from "./components/mergeSortVisualizer";
import BinarySearchVisualizer from "./components/binarySearchVisualizer";
import BST from "./components/BST";

const visualizers = {
  stack: { component: StackVisualizer, name: "Stack Visualizer" },
  queue: { component: QueueVisualizer, name: "Queue Visualizer" },
  linkedList: { component: LinkedListVisualizer, name: "Linked List Visualizer" },
  mergeSort: { component: MergeSortVisualizer, name: "Merge Sort Visualizer" },
  binarySearch: { component: BinarySearchVisualizer, name: "Binary Search Visualizer" },
  bst: { component: BST, name: "Binary Search Tree Visualizer" },
};

type VisualizerKey = keyof typeof visualizers;

const App: React.FC = () => {
  const [currentVisualizer, setCurrentVisualizer] = useState<VisualizerKey | null>(null);

  const handleVisualizerClick = (visualizerKey: VisualizerKey) => {
    setCurrentVisualizer(visualizerKey);
  };

  const handleBackClick = () => {
    setCurrentVisualizer(null);
  };

  const VisualizerButton: React.FC<{ visualizerKey: VisualizerKey; className?: string }> = ({ visualizerKey, className = "" }) => (
    <button
      className={`bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 ${className}`}
      onClick={() => handleVisualizerClick(visualizerKey)}
    >
      {visualizers[visualizerKey].name}
    </button>
  );

  const renderVisualizer = () => {
    if (currentVisualizer !== null) {
      const VisualizerComponent = visualizers[currentVisualizer].component;
      return (
        <>
          <VisualizerComponent />
          <button
            className="bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 m-3"
            onClick={handleBackClick}
          >
            Back
          </button>
        </>
      );
    }

    return (
      <div className="max-w-md w-full p-8 mx-auto">
        <h1 className="text-xl text-white font-semibold mb-3">
          Choose a Visualizer:
        </h1>
        <div className="grid grid-cols-1 gap-4">
          <VisualizerButton visualizerKey="stack" className="col-span-1" />
          <VisualizerButton visualizerKey="queue" className="col-span-1" />
          <VisualizerButton visualizerKey="linkedList" className="col-span-1" />
          <VisualizerButton visualizerKey="mergeSort" className="col-span-1" />
          <VisualizerButton visualizerKey="binarySearch" className="col-span-1" />
          <VisualizerButton visualizerKey="bst" className="col-span-1" />
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-900">
      {renderVisualizer()}
    </div>
  );
};

export default App;