import React, { useState } from "react";

const MergeSortVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<number[][]>([]); // stores all the splitting and merging steps

  const [mergeSteps, setMergeSteps] = useState<number[][]>([]); // stores all the merging steps


  // Generate an array of random numbers. Size= 10
  const generateArray = () => {
    // const newArray = Array.from({ length: 10 }, () =>
    //   Math.floor(Math.random() * 50)
    // );
    const newArray = [5, 4, 3, 2, 1]; 
    setArray(newArray);
    setSteps([]);
  };

  // Merge two sorted arrays
  const merge = (left: number[], right: number[]): number[] => {
    let mergedArray: number[] = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] < right[rightIndex]) {
        mergedArray.push(left[leftIndex]);
        leftIndex++;
      } else {
        mergedArray.push(right[rightIndex]);
        rightIndex++;
      }

    }

    mergedArray = mergedArray.concat(left.slice(leftIndex), right.slice(rightIndex))
    setMergeSteps((prevSteps) => [...prevSteps, mergedArray]);
    setSteps((prevSteps) => [...prevSteps, mergedArray]);

    return mergedArray;
  };

  // Merge sort
  const mergeSort = (arrayToSort: number[]): number[] => {
    if (arrayToSort.length <= 1) {
      return arrayToSort;
    }

    const midIndex = Math.floor(arrayToSort.length / 2);
    const left = arrayToSort.slice(0, midIndex);
    const right = arrayToSort.slice(midIndex);

    setSteps((prevSteps) => [...prevSteps, left, right]);

    return merge(mergeSort(left), mergeSort(right));
  };

  const displaySteps = () => {
    console.log(steps.length);

    return (
      <>
        {steps.map((step, index) => (
          <h1
            className=" flex flex-row  border text-center border-gray-300 rounded border-2 h3-3"
            key={index}
          >
            {step.map((i, index) => (
              <p
                className="border text-center border-gray-300 rounded border-2 h3-3"
                key={index}
              >
                {i}
              </p>
            ))}
          </h1>
        ))}

        <h1>Merge Steps:</h1>
        {mergeSteps.map((step, index) => (
          <h1
            className=" flex flex-row  border text-center border-gray-300 rounded border-2 h3-3"
            key={index}
          >
            {step.map((i, index) => (
              <p
                className="border text-center border-gray-300 rounded border-2 h3-3"
                key={index}
              >
                {i}
              </p>
            ))}
          </h1>
        ))}
      </>
    );
  };

  // Start merge sort
  const startMergeSort = () => {
    const sortedArray = mergeSort(array);
    displaySteps();
    setArray(sortedArray);
  };

  return (
    <div>
      <button
        className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mt-3"
        onClick={generateArray}
      >
        Generate Array
      </button>
      <button
        className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mt-3"
        onClick={startMergeSort}
      >
        Start Merge Sort
      </button>
      <div>
        <h3>Array:</h3>
        {array.map((num, index) => (
          <span
            className=" border text-center border-gray-300 rounded border-2 p-3"
            key={index}
          >
            {num}{" "}
          </span>
        ))}
      </div>
      <div>
        <h3>Steps:</h3>
        {displaySteps()}
      </div>
    </div>
  );
};

export default MergeSortVisualizer;
