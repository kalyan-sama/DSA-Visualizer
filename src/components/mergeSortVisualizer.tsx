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

interface CustomNodeData {
  value: number[]; // Array in the node
  borderColor: string; // Border color of the array
}

type CustomNode = Node<CustomNodeData>;
type CustomEdge = Edge;

const levelHeight = 150; // Height between levels of nodes
const width = 200; // Width to position the child nodes

// Define custom node types with a renderArray component
const nodeTypes = {
  renderArray: ({ data }: { data: CustomNodeData }) => {
    const arr = data.value;
    const borderColor = data.borderColor;
    return (
      <div className="flex" style={{ position: "relative" }}>
        <Handle type="source" position={Position.Bottom} id="sourceHandle" />
        {arr.map((value, index) => (
          <div
            key={`${index}`}
            className={`text-white text-center border-2 p-3  ${borderColor}`}
          >
            {value}
          </div>
        ))}
        <Handle type="target" position={Position.Top} id="targetHandle" />
      </div>
    );
  },
};

interface Step {
  nodes: CustomNode[];
  edges: CustomEdge[];
}

// Function to add a new step to the steps array
const addStep = (
  steps: Step[],
  nodes: CustomNode[],
  edges: CustomEdge[]
) => {
  steps.push({
    nodes: nodes.map((node) => ({ ...node, data: { ...node.data } })),
    edges: edges.map((edge) => ({ ...edge })),
  });
};

// Merge sort algorithm function with visualization steps
const mergeSort = (
  arr: number[],
  steps: Step[], // array of { nodes: [], edges: [] }
  setSteps: React.Dispatch<React.SetStateAction<Step[]>>,
  parentId: string | null = null,
  position = { x: 0, y: 0 },
  nodeIdCounter = { current: 1 }
): number[] => {

  const currentNodeId = `${nodeIdCounter.current++}`;
  let borderColor = 'border-white-500'; // Default border color: white

  //create a node with current elements in array: arr
  const currentNode: CustomNode = {
    id: currentNodeId,
    type: "renderArray",
    position: position,
    data: { value: arr, borderColor },
  };

  // Initialize steps 
  if (steps.length === 0) {
    steps.push({ nodes: [], edges: [] });
  }

  // If parent exists, add edge from parent to current node 
  if (parentId) {
    steps[steps.length - 1].edges.push({
      id: `${parentId}-${currentNodeId}`,
      source: parentId,
      target: currentNodeId,
      type: "step"
    });
  }

  // Add current node to the last step
  steps[steps.length - 1].nodes.push(currentNode);

  // Add a new step to visualize current state
  addStep(steps, steps[steps.length - 1].nodes, steps[steps.length - 1].edges);
  setSteps([...steps]);

  // Base condition for recursion
  if (arr.length <= 1) {
    return arr;
    return arr;
  }

  // Split array into left and right halfs
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  //calculate the position of child nodes based on the position of the parent node

  //position of left child
  const leftPosition = {
    x: position.x - (mid * width) / 2,
    y: position.y + levelHeight,
  };

  //position of right child
  const rightPosition = {
    x: position.x + (mid * width) / 2,
    y: position.y + levelHeight,
  };

  // Recursive calls for left and right arrays. currentNodeId will be passed as parentId
  const sortedLeft = mergeSort(left, steps, setSteps, currentNodeId, leftPosition, nodeIdCounter);
  const sortedRight = mergeSort(right, steps, setSteps, currentNodeId, rightPosition, nodeIdCounter);

  // Merge sorted arrays
  const merged = merge(sortedLeft, sortedRight);

  // Update current node with merged array and change border color
  const mergedNodeIndex = steps[steps.length - 1].nodes.findIndex(
    (node) => node.id === currentNodeId
  );
  if (mergedNodeIndex !== -1) {
    steps[steps.length - 1].nodes[mergedNodeIndex].data.value = merged;
    steps[steps.length - 1].nodes[mergedNodeIndex].data.borderColor = 'border-green-600';
  }

  // Remove child nodes and edges
  //Get the ids of left and right nodes. Iterate through the latest steps and compare teh data.value with the sorted Arrays.
  const leftNodeId = steps[steps.length - 1].nodes.find(node => node.data.value.join(',') === sortedLeft.join(','))?.id;
  const rightNodeId = steps[steps.length - 1].nodes.find(node => node.data.value.join(',') === sortedRight.join(','))?.id;

  //if node idis found, remove its corresponding node and edges from the steps
  if (leftNodeId) {
    steps[steps.length - 1].nodes = steps[steps.length - 1].nodes.filter(node => node.id !== leftNodeId);
    steps[steps.length - 1].edges = steps[steps.length - 1].edges.filter(edge => edge.target !== leftNodeId);
  }

  if (rightNodeId) {
    steps[steps.length - 1].nodes = steps[steps.length - 1].nodes.filter(node => node.id !== rightNodeId);
    steps[steps.length - 1].edges = steps[steps.length - 1].edges.filter(edge => edge.target !== rightNodeId);
  }

  // Add final merged state as a step
  addStep(steps, steps[steps.length - 1].nodes, steps[steps.length - 1].edges);
  setSteps([...steps]);

  return merged;
};
};

// Merge two sorted arrays
const merge = (left: number[], right: number[]): number[] => {
  const result: number[] = [];
  let i = 0,
    j = 0;
  let i = 0,
    j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
    if (left[i] < right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);
  return result;
};
};

// Main component for visualizing merge sort
function MergeSortVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [nodes, setNodes] = useState<CustomNode[]>([]);
  const [edges, setEdges] = useState<CustomEdge[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [array, setArray] = useState<number[]>([]);

  // Function to generate a random array
  const generateRandomArray = (size: number): number[] => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100));
  };

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  // Effect to start merge sort when array changes
  useEffect(() => {
    if (array.length > 0) {
      const steps: Step[] = [];
      const nodeIdCounter = { current: 1 };
      mergeSort(array, steps, setSteps, null, { x: 0, y: 0 }, nodeIdCounter);
    }
  }, [array]);

  // Effect to set initial nodes and edges when steps are created
  useEffect(() => {
    if (steps.length > 0) {
      setNodes(steps[0].nodes);
      setEdges(steps[0].edges);
    }
  }, [steps]);

  // Effect to fit view to nodes and edges when they change
  useEffect(() => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.fitView();
    }
  }, [nodes, edges]);

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
      return nextStep;
    });
  };

  const onPreviousStep = () => {
    setCurrentStep((prevStep) => {
      const prevStepIndex = Math.max(prevStep - 1, 0);
      setNodes(steps[prevStepIndex].nodes);
      setEdges(steps[prevStepIndex].edges);
      return prevStepIndex;
    });
  };

  const onInit = useCallback((rfi: ReactFlowInstance) => {
    reactFlowInstance.current = rfi;
  }, []);

  return (
    <div className="h-full w-full" ref={reactFlowWrapper}>
      <div className="controls">
        <button
          className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mt-3 mr-3"
          onClick={() => {
            setArray(generateRandomArray(10));
          }}
        >
          Generate Array
        </button>
        <button
          className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2"
          onClick={onPreviousStep} disabled={currentStep === 0}>
          Previous Step
        </button>
        <button
          className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2"
          onClick={onNextStep} disabled={currentStep === steps.length - 1}>
          Next Step
        </button>
      </div>
      <div className="h-5/6 w-5/6 border-2 mx-auto">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={onInit}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default MergeSortVisualizer;
