import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaRegCopy } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

interface PopupProps {
  onClose: () => void;
  codeFileName: string;
  explanationFileName: string;
}

const Popup: React.FC<PopupProps> = ({
  onClose,
  codeFileName,
  explanationFileName,
}) => {
  const [activeTab, setActiveTab] = useState<"Explanation" | "Code">("Explanation");
  const [data, setData] = useState<string>("");
  const [ExplanationHtml, setExplanationHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const customStyle = {
    borderRadius: "10px",
    backgroundColor: "#030712",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [codeResponse, explanationResponse] = await Promise.all([
          fetch("/" + codeFileName),
          fetch("/" + explanationFileName)
        ]);
        const [sourceCode, explanationText] = await Promise.all([
          codeResponse.text(),
          explanationResponse.text()
        ]);
        setData(sourceCode);
        setExplanationHtml(explanationText);
      } catch (error) {
        console.error("Error fetching the text file:", error);
      }
    };
    fetchData();
  }, [codeFileName, explanationFileName]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-gray-900 rounded-lg w-full max-w-5xl min-w-[300px] h-5/6 border-white border-2 flex flex-col shadow-3xl ">
        <div className="flex justify-between p-3 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Explanation & Code</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
          >
            <IoClose size={30} />
          </button>
        </div>
        <div className="flex border-b border-gray-700">
          {["Explanation", "Code"].map((tab) => (
            <button
            key={tab}
            className={`flex-1 p-2 font-semibold text-xl transition-all duration-200 focus:outline-none ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-400 hover:text-gray-100  "
            }`}
            onClick={() => setActiveTab(tab as "Explanation" | "Code")}
          >
            {/* {tab.charAt(0).toUpperCase() + tab.slice(1)} */}
            {tab}
          </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto">
          {activeTab === "Explanation" && (
            <div
              className="px-6"
              dangerouslySetInnerHTML={{ __html: ExplanationHtml }}
            />
          )}
          {activeTab === "Code" && (
            <div className="relative px-6 py-2">
              <div className="sticky top-0  w-full z-10 flex justify-end">
                <button
                  onClick={copyToClipboard}
                  className={`px-2 py-2 mt-2 mr-2 text-white rounded-full ${
                    copied ? "bg-green-500" : "bg-blue-600"
                  }`}
                >
                  {copied ? <IoMdCheckmarkCircleOutline /> : <FaRegCopy />}
                </button>
              </div>
              <SyntaxHighlighter
                language="python"
                style={nightOwl}
                showLineNumbers={true}
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