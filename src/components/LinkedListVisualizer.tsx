import React, { useState, useEffect } from "react";
import Popup from "./popup";

interface Node {
  value: string;
  next?: Node;
}

const ListNode: React.FC<{ node: Node }> = ({ node }) => (
  <div className="flex flex-col items-center">
    <div className="flex border-2 border-white rounded">
      <div className="w-16 text-center border-r border-white p-2">{node.value}</div>
      <div className="w-16 text-center p-2">Next</div>
    </div>
  </div>
);

const LinkedListVisualizer: React.FC = () => {
  const [list, setList] = useState<Node[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [index, setIndex] = useState<number>(0);
  const [showInsertPopUp, setShowInsertPopUp] = useState(false);
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const MAX_LIST_SIZE = 15;

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleInsert = () => {
    if (inputValue && list.length < MAX_LIST_SIZE) {
      setList([...list, { value: inputValue }]);
      setInputValue("");
    } else if (list.length >= MAX_LIST_SIZE) {
      setErrorMessage("Cannot insert more than 15 elements");
    }
  };

  const handleDeleteHead = () => list.length > 0 && setList(list.slice(1));

  const handleDeleteTail = () => list.length > 0 && setList(list.slice(0, -1));

  const handleInsertAtIndex = (index: number) => {
    if (inputValue && index >= 0 && index <= list.length && list.length < MAX_LIST_SIZE) {
      const updatedList = [...list];
      updatedList.splice(index, 0, { value: inputValue });
      setList(updatedList);
      setIndex(0);
      setInputValue("");
    } else {
      setErrorMessage(list.length >= MAX_LIST_SIZE ? "Cannot insert more than 15 elements" : "Invalid index for insertion");
    }
    setShowInsertPopUp(false);

  };

  const handleDeleteAtIndex = (index: number) => {
    if (list.length > 0 && index >= 0 && index < list.length) {
      const updatedList = [...list];
      updatedList.splice(index, 1);
      setList(updatedList);
    } else {
      setErrorMessage("Invalid index for deletion");
    }
    setIndex(0);
    setShowDeletePopUp(false);

  };

  const PopupComponent: React.FC<{
    title: string;
    onSubmit: () => void;
    onCancel: () => void;
    buttonText: string;
    buttonClass: string;
    children: React.ReactNode;
  }> = ({ title, onSubmit, onCancel, buttonText, buttonClass, children }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-800 border border-gray-600 p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-xl text-white mb-4">{title}</h2>
        {children}
        <div className="flex justify-end">
          <button className={`${buttonClass} mr-2`} onClick={onSubmit}>{buttonText}</button>
          <button className="bg-gray-600 text-white font-semibold px-4 py-2 rounded hover:bg-gray-700" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full p-8 mx-auto bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl text-white font-bold mb-6 text-center">Linked List Visualizer</h1>
      <div className="max-w-md mx-auto mb-6">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Enter a value to insert..."
            className="w-full p-2 border rounded text-black bg-gray-100"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInsert()}
          />
          <button className="bg-purple-600 text-white font-semibold p-2 px-3 rounded hover:bg-purple-700" onClick={handleInsert}>Insert</button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <button className="bg-blue-600 text-white font-semibold p-2 rounded hover:bg-blue-700" onClick={() => setShowInsertPopUp(true)}>Insert At Index</button>
          <button className="bg-blue-600 text-white font-semibold p-2 rounded hover:bg-blue-700" onClick={() => setShowDeletePopUp(true)}>Delete At Index</button>
          <button className="bg-red-600 text-white font-semibold p-2 rounded hover:bg-red-700" onClick={handleDeleteHead}>Delete Head</button>
          <button className="bg-red-600 text-white font-semibold p-2 rounded hover:bg-red-700" onClick={handleDeleteTail}>Delete Tail</button>
          <button
            onClick={() => setIsPopupOpen(true)}
            className="col-span-2 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
          >
            Open Explanation & Code
          </button>
        </div>
        {isPopupOpen && <Popup codeFileName={"utils/linked list/linked_list.py"} explanationFileName={"utils/linked list/linkedList.html"} onClose={() => setIsPopupOpen(false)} />}

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
      </div>

      {showInsertPopUp && (
        <PopupComponent
          title="Insert at Index"
          onSubmit={() => handleInsertAtIndex(index)}
          onCancel={() => setShowInsertPopUp(false)}
          buttonText="Insert"
          buttonClass="bg-purple-600 text-white font-semibold px-4 py-2 rounded hover:bg-purple-700"
        >
          <input
            type="number"
            className="w-full p-2 border rounded mb-4 text-black"
            placeholder="Enter an Index to Insert at..."
            value={index || ""}
            onChange={(e) => setIndex(parseInt(e.target.value))}
          />
          <input
            type="text"
            className="w-full p-2 border rounded mb-4 text-black"
            placeholder="Enter a value to Insert ..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </PopupComponent>
      )}

      {showDeletePopUp && (
        <PopupComponent
          title="Delete at Index"
          onSubmit={() => handleDeleteAtIndex(index)}
          onCancel={() => setShowDeletePopUp(false)}
          buttonText="Delete"
          buttonClass="bg-red-600 text-white font-semibold px-4 py-2 rounded hover:bg-red-700"
        >
          <input
            type="number"
            className="w-full p-2 border rounded mb-4 text-black"
            placeholder="Enter an Index to delete at..."
            value={index}
            onChange={(e) => setIndex(parseInt(e.target.value))}
          />
        </PopupComponent>
      )}

      <div className="bg-gray-700 p-4 rounded-lg overflow-x-auto">
        <div className="flex items-start">
          {list.length > 0 && <div className="p-2 font-bold">HEAD → </div>}
          {list.map((node, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center mr-2">
                <ListNode node={node} />
                <div className="text-sm text-gray-400 mt-1">Index: {index}</div>
              </div>
              {index < list.length - 1 && <div className="text-white p-2"> → </div>}
            </React.Fragment>
          ))}
          {list.length > 0 && <div className="text-white p-2"> → NULL</div>}
        </div>
      </div>
    </div>
  );
};

export default LinkedListVisualizer;