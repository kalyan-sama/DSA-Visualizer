import React, { useState } from "react";
import Popup from "reactjs-popup";

interface Node {
  value: string;
  next?: Node;
}

const NodeComponent: React.FC<{ node: Node }> = ({ node }) => (
  <div>
    <ul className="flex flex-row">
      <li className="border text-center border-gray-300 border-2 p-1">
        {node.value}
      </li>
      <li className="border text-center border-gray-300 border-2 p-1">Next</li>
    </ul>
  </div>
);

const LinkedListVisualizer: React.FC = () => {
  const [list, setList] = useState<Node[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [index, setIndex] = useState<number>(0);
  const [showInsertPopUp, setShowInsertPopUp] = useState(false);
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);
  const [showInsertErrorMessage, setShowInsertErrorMessage] = useState(false);
  const [showDeleteErrorMessage, setShowDeleteErrorMessage] = useState(false);


  const handleInsert = () => {
    if (inputValue !== "") {
      const newNode: Node = { value: inputValue };
      setList([...list, newNode]);
      setInputValue("");
    }
  };

  const handleDeleteHead = () => {
    if (list.length > 0) {
      setList(list.slice(1));
    }
  };

  const handleDeleteTail = () => {
    if (list.length > 0) {
      setList(list.slice(0, list.length - 1));
    }
  };

  const handleInsertAtIndex = (index: number) => {
    if (inputValue !== "") {
      const newNode: Node = { value: inputValue };

      // Validate index 
      if (index >= 0 && index <= list.length) {
        const updatedList = [...list];
        updatedList.splice(index, 0, newNode); //array.splice(startIndex, deleteCount, item1, item2, ...);
        setList(updatedList);
      } else {
        console.error("Invalid index for insertion");

        setShowInsertErrorMessage(true);
      }
      setIndex(0);
      setInputValue("");
      // setShowDeletePopUp(false);
    }
  };


  const handleDeleteAtIndex = (index: number) => {
    if (list.length > 0 && index >= 0 && index < list.length) {
      const updatedList = [...list];
      updatedList.splice(index, 1); //array.splice(startIndex, deleteCount, item1, item2, ...);
      setList(updatedList);
    } else {
      console.error("Invalid index for deletion");
      setShowDeleteErrorMessage(true);
    }
    setIndex(0);
  };

  const displayHead = () => {
    if (list.length != 0) {
      return <div className="p-1">HEAD → </div>;
    }
  };

  const displayInsertPopup = () => {
    return (
      <>
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-3xl">
          <Popup
            open={showInsertPopUp}
            onClose={() => setShowInsertPopUp(false)}
          >
            <div className="flex flex-col bg-black border border-gray-300 p-4 rounded-lg">
              <p className="text-xl text-white mb-1">Index</p>
              <input
                type="number"
                className="md:w-full p-2 border rounded mb-3 text-black mr-2"
                placeholder="Enter an Index to Insert at..."
                value={index || ""}
                onChange={(e) => setIndex(parseInt(e.target.value))}
              />
              <p className="text-xl text-white mb-1">Value</p>
              <input
                type="text"
                className="w-full p-2 border rounded mb-3 text-black mr-2"
                placeholder="Enter a value to Insert ..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mt-3"
                onClick={() => {
                  handleInsertAtIndex(index);
                  setShowInsertPopUp(false);
                }}
              >
                Insert at Index
              </button>
            </div>
          </Popup>
        </div>
      </>
    );
  };

  const displayDeletePopup = () => {
    return (
      <>
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-3xl">
          <Popup
            open={showDeletePopUp}
            onClose={() => setShowDeletePopUp(false)}
          >
            <div className="flex flex-col bg-black border border-gray-300 p-4 rounded-lg">
              <input
                type="number"
                className="w-full p-2 border rounded mb-3 text-black mr-2"
                placeholder="Enter an Index to delete at..."
                value={index ||''}
                onChange={(e) => setIndex(parseInt(e.target.value))}
              />
              <button
                className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3"
                onClick={() => {
                  handleDeleteAtIndex(index);
                  setShowDeletePopUp(false);
                }}
              >
                Delete at Index
              </button>
            </div>
          </Popup>
        </div>
      </>
    );
  };

  const displayInsertAlertMessage = (message:string) => {
    return (
      <div
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          <p>{message}</p>
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
            onClick={()=>setShowInsertErrorMessage(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
    )
  
  };

  const displayDeleteAlertMessage = (message:string) => {
    return (
      <div
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          <p>{message}</p>
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
            onClick={()=>setShowDeleteErrorMessage(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
    )
  
  };

  return (
    <>
      <div className="max-w-md w-full p-8 mx-auto">
        <h1 className="text-xl text-white font-semibold mb-3">
          Linked List Visualizer
        </h1>
        <div>
          <input
            type="text"
            placeholder="Enter a value to insert into linked list..."
            required = {true}
            className="w-full p-2 border rounded mb-3 text-black"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          
          <div className="flex flex-row">
            <button
              className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2"
              onClick={handleInsert}
            >
              Insert
            </button>

            <button
              className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2"
              onClick={handleDeleteHead}
            >
              Delete Head
            </button>

            <button
              className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3"
              onClick={handleDeleteTail}
            >
              Delete Tail
            </button>
          </div>

          <div className="flex flex-row">
            <button
              className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mr-2"
              onClick={() => {
                setShowInsertPopUp(true);
                // setShowDeletePopUp(false);
              }}
            >
              Insert At Index
            </button>

            <button
              className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3"
              onClick={() => {
                setShowDeletePopUp(true);
                // setShowInsertPopUp(false);
              }}
            >
              Delete At Index
            </button>
          </div>
        </div>
        {/*  Display as a Pop Up window */}
        {showInsertPopUp && displayInsertPopup()}
        {showInsertErrorMessage && (displayInsertAlertMessage("Invalid index for insertion"))}

        {/* {Deletion at Index} */}
        {showDeletePopUp && displayDeletePopup()}
        {showDeleteErrorMessage && (displayDeleteAlertMessage("Invalid index for deletion"))}

      </div>
      <div className="flex flex-row items-center ">
        {displayHead()}
        {list.map((node, index) => (
          <React.Fragment key={index}>
            <div className="pt-4">
              <NodeComponent node={node} />
              <div className="pl-1">Index:{index}</div>
            </div>
            {index < list.length - 1 && <div className="p-1"> → </div>}
            {index == list.length - 1 && <div className="p-1"> → NULL</div>}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default LinkedListVisualizer;
