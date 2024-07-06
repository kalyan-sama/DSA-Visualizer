import React, { useCallback, useEffect, useState, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  Handle,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Position,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import Popup from "./popup";

interface CustomNodeData {
  value: ({ value: number; highlight: boolean } | number | null)[];
  borderColor: string;
}

type CustomNode = Node<CustomNodeData>;
type CustomEdge = Edge;

const MAX_ARRAY_SIZE = 10;
const levelHeight = 150; // Height between levels of nodes
const width = 200; // Width to position the child nodes

// Define custom node types with a renderArray component. This will be the custom node in the flow
const nodeTypes = {
  renderArray: ({ data }: { data: CustomNodeData }) => {
    const arr = data.value;
    const borderColor = data.borderColor;
    const bgColor = borderColor === "border-green-500" ? "bg-green-900" : "";
    return (
      <div className={`flex rounded `}>
        <Handle type="source" position={Position.Bottom} id="sourceHandle" />
        {arr.map((item, index) => {
          let value: number | null = null;
          let highlight = false;

          if (typeof item === "number") {
            value = item;
          } else if (item && typeof item === "object" && "value" in item) {
            value = item.value;
            highlight = item.highlight;
          }

          const itemBgColor = highlight ? "bg-yellow-900" : bgColor;
          const itemBorderColor = highlight ? "border-yellow-500" : borderColor;

          return (
            <div
              key={`${index}`}
              className={`text-white text-center rounded border-2 p-3 ${itemBorderColor} ${itemBgColor}`}
            >
              {value !== null ? value : ""}
            </div>
          );
        })}
        <Handle type="target" position={Position.Top} id="targetHandle" />
      </div>
    );
  },
};

interface Step {
  nodes: CustomNode[];
  edges: CustomEdge[];
  explanation: string;
}
// Function to add a new step to the steps array
const addStep = (
  steps: Step[],
  nodes: CustomNode[],
  edges: CustomEdge[],
  explanation: string
) => {
  steps.push({
    nodes: nodes.map((node) => ({ ...node, data: { ...node.data } })),
    edges: edges.map((edge) => ({ ...edge })),
    explanation,
  });
};

const merge = (
  left: number[],
  right: number[]
): {
  result: number[];
  steps: { merged: number[]; leftIndex: number; rightIndex: number }[];
} => {
  const result: number[] = [];
  const steps: { merged: number[]; leftIndex: number; rightIndex: number }[] =
    [];
  let i = 0,
    j = 0;

  while (i < left.length && j < right.length) {
    steps.push({ merged: [...result], leftIndex: i, rightIndex: j });
    if (left[i] < right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  while (i < left.length) {
    steps.push({ merged: [...result], leftIndex: i, rightIndex: j });
    result.push(left[i++]);
  }
  while (j < right.length) {
    steps.push({ merged: [...result], leftIndex: i, rightIndex: j });
    result.push(right[j++]);
  }

  steps.push({ merged: result, leftIndex: i, rightIndex: j }); // Final state
  return { result, steps };
};

const mergeSort = (
  arr: number[],
  steps: Step[], // array of { nodes: [], edges: [] }
  setSteps: React.Dispatch<React.SetStateAction<Step[]>>,
  parentId: string | null = null,
  position = { x: 0, y: 0 },
  nodeIdCounter = { current: 1 }
): number[] => {
  const currentNodeId = `${nodeIdCounter.current++}`;
  let borderColor = "border-white-500";

  //create a node with current elements in array: arr
  const currentNode: CustomNode = {
    id: currentNodeId,
    type: "renderArray",
    position: position,
    data: { value: arr, borderColor },
  };

  if (steps.length === 0) {
    steps.push({ nodes: [], edges: [], explanation: "" });
  }

  // If parent exists, add edge from parent to current node
  if (parentId) {
    steps[steps.length - 1].edges.push({
      id: `${parentId}-${currentNodeId}`,
      source: parentId,
      target: currentNodeId,
      type: "step",
    });
  }

  // Add current node to the last step
  steps[steps.length - 1].nodes.push(currentNode);

  // Base condition for recursion
  if (arr.length <= 1) {
    addStep(
      steps,
      steps[steps.length - 1].nodes,
      steps[steps.length - 1].edges,
      `Array [${arr.join(", ")}] is already sorted.`
    );
    setSteps([...steps]);
    return arr;
  }

  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  addStep(
    steps,
    steps[steps.length - 1].nodes,
    steps[steps.length - 1].edges,
    `Splitting [${arr.join(", ")}] to [${left.join(", ")}], [${right.join(", ")}]`
  );
  setSteps([...steps]);

  //calculate the position of child nodes based on the position of the parent node

  const leftPosition = {
    x: position.x - (mid * width) / 2,
    y: position.y + levelHeight,
  };

  const rightPosition = {
    x: position.x + (mid * width) / 2,
    y: position.y + levelHeight,
  };

  // Recursive calls for left and right arrays. currentNodeId will be passed as parentId
  const sortedLeft = mergeSort(
    left,
    steps,
    setSteps,
    currentNodeId,
    leftPosition,
    nodeIdCounter
  );
  const sortedRight = mergeSort(
    right,
    steps,
    setSteps,
    currentNodeId,
    rightPosition,
    nodeIdCounter
  );

  const { result: merged } = merge(sortedLeft, sortedRight);

  const mergedNodeIndex = steps[steps.length - 1].nodes.findIndex(
    (node) => node.id === currentNodeId
  );
  const leftNodeIndex = steps[steps.length - 1].nodes.findIndex(
    (node) => node.data.value.join(",") === sortedLeft.join(",")
  );
  const rightNodeIndex = steps[steps.length - 1].nodes.findIndex(
    (node) => node.data.value.join(",") === sortedRight.join(",")
  );

  if (mergedNodeIndex !== -1 && leftNodeIndex !== -1 && rightNodeIndex !== -1) {
    let i = 0,
      j = 0;
    const result: number[] = [];
    let explanationMessage;
    while (i < sortedLeft.length && j < sortedRight.length) {
      // Add step before comparison
      let explanationMessage = `Comparing ${sortedLeft[i]} and ${sortedRight[j]}`;
      addStep(
        steps,
        steps[steps.length - 1].nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            value:
              node.id === currentNodeId
                ? [...result, ...Array(arr.length - result.length).fill(null)]
                : node.data.value,
          },
        })),
        steps[steps.length - 1].edges,
        explanationMessage
      );

      // Highlight current elements
      steps[steps.length - 1].nodes[leftNodeIndex].data.value = sortedLeft.map(
        (val, idx) => ({ value: val, highlight: idx === i })
      );
      steps[steps.length - 1].nodes[rightNodeIndex].data.value =
        sortedRight.map((val, idx) => ({ value: val, highlight: idx === j }));

      // Perform comparison and add element
      if (sortedLeft[i] < sortedRight[j]) {
        result.push(sortedLeft[i]);
        i++;
      } else {
        result.push(sortedRight[j]);
        j++;
      }

      // Update merged node
      steps[steps.length - 1].nodes[mergedNodeIndex].data.value = [
        ...result,
        ...Array(arr.length - result.length).fill(null),
      ];

      setSteps([...steps]);
    }

    // Handle remaining elements
    while (i < sortedLeft.length) {
      explanationMessage = `Adding remaining element from left array: ${sortedLeft[i]}`;
      addStep(
        steps,
        steps[steps.length - 1].nodes,
        steps[steps.length - 1].edges,
        explanationMessage
      );
      result.push(sortedLeft[i]);
      i++;
      steps[steps.length - 1].nodes[mergedNodeIndex].data.value = [
        ...result,
        ...Array(arr.length - result.length).fill(null),
      ];
      setSteps([...steps]);
    }

    while (j < sortedRight.length) {
      explanationMessage = `Adding remaining element from right array: ${sortedRight[j]}`;
      addStep(
        steps,
        steps[steps.length - 1].nodes,
        steps[steps.length - 1].edges,
        explanationMessage
      );
      result.push(sortedRight[j]);
      j++;
      steps[steps.length - 1].nodes[mergedNodeIndex].data.value = [
        ...result,
        ...Array(arr.length - result.length).fill(null),
      ];
      setSteps([...steps]);
    }

    explanationMessage = `Merging completed. Merged array: [${result.join(", ")}]`;
    addStep(
      steps,
      steps[steps.length - 1].nodes,
      steps[steps.length - 1].edges,
      explanationMessage
    );

    steps[steps.length - 1].nodes[mergedNodeIndex].data.borderColor =
      "border-green-500";

    // Remove left and right child nodes. Filter out nodes where ids are not leftNodeId & rightNodeId
    const leftNodeId = steps[steps.length - 1].nodes[leftNodeIndex]?.id;
    const rightNodeId = steps[steps.length - 1].nodes[rightNodeIndex]?.id;

    steps[steps.length - 1].nodes = steps[steps.length - 1].nodes.filter(
      (node) => node.id !== leftNodeId && node.id !== rightNodeId
    );
    steps[steps.length - 1].edges = steps[steps.length - 1].edges.filter(
      (edge) => edge.target !== leftNodeId && edge.target !== rightNodeId
    );

    setSteps([...steps]);
  }

  return merged;
};

function MergeSortVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [nodes, setNodes] = useState<CustomNode[]>([]);
  const [edges, setEdges] = useState<CustomEdge[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [array, setArray] = useState<number[]>([]);
  const [stepExplanation, setStepExplanation] = useState<string>("");
  const [isAutoMode, setIsAutoMode] = useState(false);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  console.log(array);
  useEffect(() => {
    if (array.length === 0) {
      setArray(generateRandomArray(10));
    }
  }, []);

  const generateRandomArray = (size: number): number[] => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100));
  };

  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  useEffect(() => {
    if (array.length > 0) {
      const steps: Step[] = [];
      const nodeIdCounter = { current: 1 };
      mergeSort(array, steps, setSteps, null, { x: 0, y: 0 }, nodeIdCounter);
    }
  }, [array]);

  useEffect(() => {
    if (steps.length > 0) {
      setNodes(steps[0].nodes);
      setEdges(steps[0].edges);
      setStepExplanation(steps[0].explanation);
    }
  }, [steps]);

  useEffect(() => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.fitView();
    }
  }, [nodes, edges]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isAutoMode && currentStep < steps.length - 1) {
      intervalId = setInterval(onNextStep, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isAutoMode, currentStep, steps.length]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onNextStep = () => {
    setCurrentStep((prevStep) => {
      const nextStep = Math.min(prevStep + 1, steps.length - 1);
      setNodes(steps[nextStep].nodes);
      setEdges(steps[nextStep].edges);
      setStepExplanation(steps[nextStep].explanation);
      return nextStep;
    });
  };

  const onPreviousStep = () => {
    setCurrentStep((prevStep) => {
      const prevStepIndex = Math.max(prevStep - 1, 0);
      setNodes(steps[prevStepIndex].nodes);
      setEdges(steps[prevStepIndex].edges);
      setStepExplanation(steps[prevStepIndex].explanation);
      return prevStepIndex;
    });
  };

  const onInit = useCallback((rfi: ReactFlowInstance) => {
    reactFlowInstance.current = rfi;
  }, []);

  const toggleAutoMode = () => {
    setIsAutoMode((prev) => !prev);
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-1/4 p-4">
        <h1 className="text-xl font-bold mb-8 text-center text-white">
          Merge Sort Visualizer
        </h1>
        <div className="controls flex flex-col">
          <button
            className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mt-3"
            onClick={() => {
              setArray(generateRandomArray(MAX_ARRAY_SIZE));
              setCurrentStep(0);
              setIsAutoMode(false);
            }}
          >
            Generate New Array
          </button>
          <div className="flex flex-row gap-2">
            <button
              className="flex-1 bg-blue-600 text-white font-semibold p-2 rounded hover:bg-blue-700 mb-3 "
              onClick={onPreviousStep}
              disabled={currentStep === 0 || isAutoMode}
            >
              Previous Step
            </button>
            <button
              className="flex-1 bg-green-600 text-white font-semibold p-2 rounded hover:bg-green-700 mb-3 "
              onClick={onNextStep}
              disabled={currentStep === steps.length - 1 || isAutoMode}
            >
              Next Step
            </button>
          </div>
          <button
            className={`flex-1 text-white font-semibold p-2 rounded mb-2 ${isAutoMode ? "bg-red-600" : "bg-yellow-600"}`}
            onClick={toggleAutoMode}
          >
            {isAutoMode ? "Pause" : "Auto"}
          </button>

          <button
						onClick={() => setIsPopupOpen(true)}
						className="flex-1 max-w-md mt-2 py-2 bg-blue-600 text-white font-semibold rounded mb-4"
					>
						Open Explanation & Code
					</button>
					{isPopupOpen && <Popup codeFileName={"utils/merge sort/merge_sort.py"} explanationFileName={"utils/merge sort/merge_sort.html"} onClose={() => setIsPopupOpen(false)} />}

        </div>
        <div className="mt-4">
          <h3 className="text-xl underline font-bold">Sorting Steps:</h3>
          <p>{stepExplanation}</p>
        </div>
      </div>
      <div className="w-3/4 h-full border-2">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={onInit}
          nodesDraggable={false}
          fitView
        >
          <Background />
          <Controls 
            showInteractive={false}>
          </Controls>
        </ReactFlow>
      </div>
    </div>
  );
}

export default MergeSortVisualizer;
