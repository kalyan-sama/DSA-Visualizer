import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaRegCopy } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

interface PopupProps {
  onClose: () => void;
  codeFileName: any;
  explanationFileName: any;
}

const Popup: React.FC<PopupProps> = ({
  onClose,
  codeFileName,
  explanationFileName,
}) => {
  const [activeTab, setActiveTab] = useState<"explanation" | "code">(
    "explanation"
  );
  const [data, setData] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const customStyle = {
    borderRadius: "10px",
    backgroundColor: "#030712",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const codeResponse = await fetch("/" + codeFileName);
        const explanationResponse = await fetch("/" + explanationFileName);
        const sourceCode = await codeResponse.text();
        const explanationText = await explanationResponse.text();
        setData(sourceCode);
        setExplanation(explanationText);
      } catch (error) {
        console.error("Error fetching the text file:", error);
      }
    };
    fetchData();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(data);
    alert("Code copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 rounded-lg w-3/4 h-5/6 border-white border-2 flex flex-col">
        <div className="flex justify-between p-3 border-b">
          <h2 className="text-2xl font-bold">Explanation & Code</h2>
          <button onClick={onClose} className="text-red-500 rounded">
            <IoClose size={30} />
          </button>
        </div>
        <div className="flex border-b">
          <button
            className={`flex-1 p-2 font-semibold text-xl ${activeTab === "explanation" ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => setActiveTab("explanation")}
          >
            Explanation
          </button>
          <button
            className={`flex-1 p-2 font-semibold text-xl ${activeTab === "code" ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => setActiveTab("code")}
          >
            Code
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {activeTab === "explanation" && (
            <div dangerouslySetInnerHTML={{ __html: explanation }} />
          )}
          {activeTab === "code" && (
            <div className=" relative overflow-auto p-4 ">
              <div className="">
                <button
                  onClick={copyToClipboard}
                  className=" sticky top-0 right-0 px-2 py-2 bg-blue-500 text-white rounded-full opacity-50"
                >
                  <FaRegCopy />
                </button>
              </div>
              <SyntaxHighlighter
                language="python"
                style={nightOwl}
                customStyle={customStyle}
              >
                {data}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Popup;
