import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MarkerType,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

const MAX_ARRAY_SIZE = 15;
const border_yellow = "#eab308";
const bg_yellow = "#713f12";
const border_green = "#0ad655";
const bg_green = "#166534";
const border_red = "#fc1302";
const bg_red = "#901717";

const BST: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [inputValue, setInputValue] = useState("");
  const [steps, setSteps] = useState<Function[]>([]);
  const [message, setMessage] = useState<string>("");
  const [inputError, setInputError] = useState<string>("");
  const [isAutoMode, setIsAutoMode] = useState(false);
  const rootRef = useRef<TreeNode | null>(null);

  const createTreeNode = (value: number): TreeNode => {
    return { value, left: null, right: null };
  };

  const getTreeWidth = (node: TreeNode | null): number => {
    if (!node) return 0;
    return getTreeWidth(node.left) + 1 + getTreeWidth(node.right);
  };

  const insert = (root: TreeNode | null, value: number): TreeNode => {
    if (root === null) {
      return createTreeNode(value);
    }

    if (value < root.value) {
      root.left = insert(root.left, value);
    } else if (value > root.value) {
      root.right = insert(root.right, value);
    }

    return root;
  };

  const search = (root: TreeNode | null, value: number): TreeNode | null => {
    if (root === null || root.value === value) return root;
    if (value < root.value) return search(root.left, value);
    return search(root.right, value);
  };

  const generateRandomArray = (size: number): number[] => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100));
  };

  const createRandomTree = (): TreeNode => {
    const values = generateRandomArray(MAX_ARRAY_SIZE);
    // const values = [50, 20, 60, 10, 11, 5, 70, 55, 71];
    let root: TreeNode | null = null;

    for (const value of values) {
      root = insert(root, value);
    }

    return root!;
  };

  const createFlowNodes = (
    root: TreeNode | null,
    x: number,
    y: number,
    level: number,
    parentWidth: number
  ): Node[] => {
    if (!root) return [];

    const nodeSize = 40;
    const verticalSpacing = 120;
    const leftWidth = getTreeWidth(root.left);
    const rightWidth = getTreeWidth(root.right);
    const totalWidth = leftWidth + 1 + rightWidth;
    const widthUnit = parentWidth / totalWidth;

    const currentNode: Node = {
      id: root.value.toString(),
      position: { x, y },
      data: { label: root.value },
      style: {
        width: nodeSize,
        height: nodeSize,
        borderRadius: "50%",
        border: "2px solid white",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "14px",
        backgroundColor: "rgba(75, 85, 99, 0.6)",
      },
    };

    const leftNodes = createFlowNodes(
      root.left,
      x - widthUnit * (rightWidth + 0.7) * nodeSize,
      y + verticalSpacing,
      level + 1,
      leftWidth + widthUnit
    );
    const rightNodes = createFlowNodes(
      root.right,
      x + widthUnit * (leftWidth + 0.7) * nodeSize,
      y + verticalSpacing,
      level + 1,
      rightWidth + widthUnit
    );

    return [currentNode, ...leftNodes, ...rightNodes];
  };

  const createFlowEdges = (root: TreeNode | null): Edge[] => {
    if (!root) return [];

    const edges: Edge[] = [];

    if (root.left) {
      edges.push({
        id: `${root.value}-${root.left.value}`,
        source: root.value.toString(),
        target: root.left.value.toString(),
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: "white" },
      });
      edges.push(...createFlowEdges(root.left));
    }

    if (root.right) {
      edges.push({
        id: `${root.value}-${root.right.value}`,
        source: root.value.toString(),
        target: root.right.value.toString(),
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: "white" },
      });
      edges.push(...createFlowEdges(root.right));
    }

    return edges;
  };

  const initializeTree = useCallback(() => {
    const root = createRandomTree();
    rootRef.current = root;
    const treeWidth = getTreeWidth(root);
    const flowNodes = createFlowNodes(root, 0, 300, 50, treeWidth);
    const flowEdges = createFlowEdges(root);

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [setNodes, setEdges]);

  useEffect(() => {
    initializeTree();
  }, [initializeTree]);

  const updateNodeStyle = (
    nodeId: string,
    borderColor: string,
    bgColor: string
  ) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            style: {
              ...node.style,
              border: `2px solid ${borderColor}`,
              backgroundColor: bgColor,
            },
          };
        }
        return node;
      })
    );
  };

  const updateEdgeStyle = (
    sourceId: string,
    targetId: string,
    color: string
  ) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (
          (edge.source === sourceId && edge.target === targetId) ||
          (edge.source === targetId && edge.target === sourceId)
        ) {
          return {
            ...edge,
            style: { ...edge.style, stroke: color },
            animated: true,
          };
        }
        return edge;
      })
    );
  };

  const resetStyles = () => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        style: {
          ...node.style,
          border: "2px solid white",
          backgroundColor: "rgba(75, 85, 99, 0.6)",
        },
      }))
    );
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        style: { ...edge.style, stroke: "white" },
        animated: false,
      }))
    );
  };

  const generateInsertSteps = (
    root: TreeNode | null,
    value: number
  ): Function[] => {
    const steps: Function[] = [];
    let current = root;
    let path: string[] = [];

    const addHighlightStep = (nodeId: string) => {
      if (path.length > 0) {
        const parentId = path[path.length - 1];
        steps.push(() => {
          updateNodeStyle(nodeId, border_yellow, bg_yellow);
          updateEdgeStyle(parentId, nodeId, border_yellow);
          setMessage(`Inserting: Comparing ${value} with ${nodeId}`);
        });
      } else {
        steps.push(() => {
          updateNodeStyle(nodeId, border_yellow, bg_yellow);
          setMessage(`Inserting: Starting at the root node ${nodeId}`);
        });
      }
      path.push(nodeId);
    };

    while (current) {
      const currentId = current.value.toString();
      addHighlightStep(currentId);

      if (value < current.value) {
        if (current.left) {
          current = current.left;
        } else {
          steps.push(() => {
            const newNode = createTreeNode(value);
            current!.left = newNode;
            const treeWidth = getTreeWidth(rootRef.current);
            const newFlowNodes = createFlowNodes(
              rootRef.current,
              300,
              50,
              0,
              treeWidth
            );
            const newFlowEdges = createFlowEdges(rootRef.current);
            setNodes(newFlowNodes);
            setEdges(newFlowEdges);
            updateNodeStyle(value.toString(), border_green, bg_green);
            updateEdgeStyle(currentId, value.toString(), bg_green);
            setMessage(`Inserting ${value} as left child of ${currentId}`);
          });
          break;
        }
      } else if (value > current.value) {
        if (current.right) {
          current = current.right;
        } else {
          steps.push(() => {
            const newNode = createTreeNode(value);
            current!.right = newNode;
            const treeWidth = getTreeWidth(rootRef.current);
            const newFlowNodes = createFlowNodes(
              rootRef.current,
              300,
              50,
              0,
              treeWidth
            );
            const newFlowEdges = createFlowEdges(rootRef.current);
            setNodes(newFlowNodes);
            setEdges(newFlowEdges);
            updateNodeStyle(value.toString(), border_green, bg_green);
            updateEdgeStyle(currentId, value.toString(), bg_green);
            setMessage(`Inserting ${value} as right child of ${currentId}`);
          });
          break;
        }
      } else {
        steps.push(() => {
          setMessage(`Input Value ${value} already exists in the tree`);
        });
        break;
      }
    }

    steps.push(() => {
      resetStyles();
      setMessage("Insertion complete");
    });
    return steps;
  };

  const generateSearchSteps = (
    root: TreeNode | null,
    value: number
  ): Function[] => {
    const steps: Function[] = [];
    let current = root;
    let path: string[] = [];

    const addHighlightStep = (nodeId: string) => {
      if (path.length > 0) {
        const parentId = path[path.length - 1];
        steps.push(() => {
          updateNodeStyle(nodeId, border_yellow, bg_yellow);
          updateEdgeStyle(parentId, nodeId, border_yellow);
          setMessage(`Searching: Comparing ${value} with ${nodeId}`);
        });
      } else {
        steps.push(() => {
          updateNodeStyle(nodeId, border_yellow, bg_yellow);
          setMessage(`Searching: Starting search at the root node ${nodeId}`);
        });
      }
      path.push(nodeId);
    };

    while (current) {
      const currentId = current.value.toString();
      addHighlightStep(currentId);

      if (value === current.value) {
        steps.push(() => {
          updateNodeStyle(currentId, border_green, bg_green);
          setMessage(`Value ${value} found in the tree`);
        });
        break;
      } else if (value < current.value) {
        if (current.left) {
          current = current.left;
        } else {
          steps.push(() => {
            setMessage(`Value ${value} not found in the tree`);
          });
          break;
        }
      } else {
        if (current.right) {
          current = current.right;
        } else {
          steps.push(() => {
            setMessage(`Value ${value} not found in the tree`);
          });
          break;
        }
      }
    }

    steps.push(() => {
      resetStyles();
      setMessage("Search complete");
    });
    return steps;
  };

  const generateDeleteSteps = (root: TreeNode | null, value: number): Function[] => {
    const steps: Function[] = [];
    let current = root;
    let parent: TreeNode | null = null;
    let path: string[] = [];
  
    // Step 1: Search for the node to delete
    while (current && current.value !== value) {
      const currentId = current.value.toString();
      const parentId = parent ? parent.value.toString() : null;
      
      steps.push(() => {
        updateNodeStyle(currentId, border_yellow, bg_yellow);
        if (parentId) {
          updateEdgeStyle(parentId, currentId, border_yellow);
        }
        setMessage(`Deleting: Searching for ${value}: Comparing with ${currentId}`);
      });
  
      parent = current;
      path.push(currentId);
  
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
  
    if (!current) {
      steps.push(() => {
        setMessage(`Value ${value} not found in the tree`);
      });
      steps.push(resetStyles);
      return steps;
    }
  
    const currentId = current.value.toString();
    const parentId = parent ? parent.value.toString() : null;
  
    // Step 2: Node found, highlight it
    steps.push(() => {
      updateNodeStyle(currentId, border_red, bg_red);
      if (parentId) {
        updateEdgeStyle(parentId, currentId, border_red);
      }
      setMessage(`Found node to delete: ${currentId}`);
    });
  
    // Step 3: Handle deletion based on node type (leaf, one child, or two children)
    if (!current.left && !current.right) {
      // Leaf node
      steps.push(() => {
        setMessage(`Deleting leaf node ${currentId}`);
        if (parentId) {
          updateEdgeStyle(parentId, currentId, "transparent");
        }
      });
    } else if (!current.left || !current.right) {
      // Node with one child
      const childId = (current.left || current.right)!.value.toString();
      steps.push(() => {
        updateNodeStyle(childId, border_green, bg_green);
        if (parentId) {
          updateEdgeStyle(parentId, childId, border_green);
        }
        setMessage(`Replacing ${currentId} with its child ${childId}`);
      });
    } else {
      // Node with two children
      let successor = current.right;
      let successorParent = current;
      while (successor.left) {
        successorParent = successor;
        successor = successor.left;
      }
      const successorId = successor.value.toString();
      
      steps.push(() => {
        updateNodeStyle(successorId, border_green, bg_green);
        updateEdgeStyle(successorParent.value.toString(), successorId, border_green);
        setMessage(`Found inorder successor: ${successorId}`);
      });
      
      steps.push(() => {
        updateNodeStyle(currentId, border_green, bg_green);
        updateEdgeStyle(parentId!, currentId, border_green);
        setMessage(`Replacing ${currentId} with inorder successor ${successorId}`);
      });
    }

    // Step 4: Update the tree structure
    steps.push(() => {
      rootRef.current = deleteNode(rootRef.current, value);
      const newNodes = createFlowNodes(rootRef.current, 300, 50, 0, getTreeWidth(rootRef.current));
      const newEdges = createFlowEdges(rootRef.current);
      setNodes(newNodes);
      setEdges(newEdges);
      setMessage(`Node ${value} deleted from the tree`);
    });
  
    steps.push(resetStyles);
    return steps;
  };

  const deleteNode = (
    root: TreeNode | null,
    value: number
  ): TreeNode | null => {
    if (root === null) return root;

    if (value < root.value) {
      root.left = deleteNode(root.left, value);
    } else if (value > root.value) {
      root.right = deleteNode(root.right, value);
    } else {
      if (root.left === null) {
        return root.right;
      } else if (root.right === null) {
        return root.left;
      }

      let replacementParent = root;
      let replacement = root.right;
      while (replacement.left !== null) {
        replacementParent = replacement;
        replacement = replacement.left;
      }

      if (replacementParent !== root) {
        replacementParent.left = replacement.right;
        replacement.right = root.right;
      }
      replacement.left = root.left;

      return replacement;
    }

    return root;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value === "" ? "" : value);
    setInputError("");
  };

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setInputError("Please enter a valid number");
      return;
    }
    const newSteps = generateInsertSteps(rootRef.current, value);
    setSteps(newSteps);
    setMessage(`Inserting ${value} into the current tree (click on Next/Auto to continue)`);
    resetAutoMode();
    setInputValue("");
  };

  const handleSearch = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setInputError("Please enter a valid number");
      return;
    }
    const newSteps = generateSearchSteps(rootRef.current, value);
    setSteps(newSteps);
    setMessage(`Searching for ${value} in the current tree (click on Next/Auto to continue)`);
    resetAutoMode();
    setInputValue("");
  };

  const handleDelete = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setInputError("Please enter a valid number");
      return;
    }
    const newSteps = generateDeleteSteps(rootRef.current, value);
    setSteps(newSteps);
    setMessage("Starting deletion process (click on Next/Auto to continue)");
    resetAutoMode();
    setInputValue("");
  };

  const handleNext = () => {
    if (steps.length > 0) {
      const nextStep = steps.shift()!;
      nextStep();
      setSteps([...steps]);
    } else {
      setMessage("Operation complete");
    }
  };

  const handleAuto = () => {
    setIsAutoMode((prev) => !prev);
  };

  const resetAutoMode = () => {
    setIsAutoMode(false);
  };

  const handleNewTree = () => {
    initializeTree();
    setMessage("New tree created");
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isAutoMode && steps.length > 0) {
      intervalId = setInterval(() => {
        handleNext();
      }, 1000);
    } else if (isAutoMode && steps.length === 0) {
      resetAutoMode();
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoMode, steps]);

  return (
    <div className="flex h-screen w-full">
      <div className="w-1/4 p-4">
        <h2 className="text-xl font-bold mb-8 text-center text-white">
          BST Visualizer
        </h2>
        <div className="flex flex-col">
  <button
    onClick={handleNewTree}
    className="bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mt-3"
    disabled={isAutoMode}
  >
    Generate New Tree
  </button>
  <div className="mb-3">
    <input
      type="number"
      value={inputValue}
      onChange={handleInputChange}
      className={`w-full p-2 border-2 rounded-lg text-white bg-gray-800 ${
        inputError ? "border-red-500" : "border-white"
      }`}
      placeholder="Enter an input value..."
    />
    {inputError && (
      <div className="mt-1 text-red-500 text-xs">
        {inputError}
      </div>
    )}
    <div className="flex mt-3">
      <button
        onClick={handleInsert}
        className="flex-1 bg-blue-500 font-semibold text-white py-2 rounded mr-2"
        disabled={isAutoMode}
      >
        Insert
      </button>
      <button
        onClick={handleSearch}
        className="flex-1 bg-purple-500 font-semibold text-white py-2 rounded mr-2"
        disabled={isAutoMode}
      >
        Search
      </button>
      <button
        onClick={handleDelete}
        className="flex-1 bg-red-500 font-semibold text-white py-2 rounded"
        disabled={isAutoMode}
      >
        Delete
      </button>
    </div>
  </div>
  <div className="flex">
    <button
      onClick={handleNext}
      className="flex-1 bg-green-500 font-semibold text-white p-2 rounded mr-2"
      disabled={isAutoMode || steps.length === 0}
    >
      Next
    </button>
    <button
      onClick={handleAuto}
      className={`flex-1 text-white font-semibold p-2 rounded ${
        isAutoMode ? "bg-red-600" : "bg-yellow-600"
      }`}
    >
      {isAutoMode ? "Pause" : "Auto"}
    </button>
  </div>
  <div className="mt-4">
    <p className="text-xl underline font-bold">Operation Steps:</p>
    <p>{message}</p>
  </div>
</div>

      </div>
      <div className="w-3/4 border-2 border-white">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          defaultEdgeOptions={{
            style: { strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed },
          }}
          fitView
        >
            <Background/ >
            <Controls />
            </ReactFlow>
      </div>
    </div>
  );
};

export default BST;
