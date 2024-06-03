import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';


interface Step {
  type: string;
  array?: number[];
  result?: number[];
  leftIndex?: number;
  rightIndex?: number;
  left?: number[];
  right?: number[];
  level: number;
  parent?: string;
  pos_x?: string;
  pos_y?: string;
}
  const generateRandomArray = (size = 10): number[] => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100));
  };
  
  

const MergeSortVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>(generateRandomArray());
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [renderedSteps, setRenderedSteps] = useState<Step[]>([]);
  const [displayArray, setDisplayArray] = useState(0);


  // useEffect(() => {
  //   const animations: Step[] = [];
  //   mergeSort(array.slice(), 0, animations);
  //   setSteps(animations);
  // }, [array]);  

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlay && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prevStep => prevStep + 1);
      }, 1000); // Adjust the interval duration as needed
    } else {
      clearInterval(interval!);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, currentStep, steps]);

  useEffect(() => {
    const renderSteps = () => {
      setRenderedSteps((prevRenderedSteps) => {
        let newRenderedSteps = [...prevRenderedSteps];
        const currentStepData = steps[currentStep];

        const existingStepIndex = newRenderedSteps.findIndex(
          (step) => step.level === currentStepData.level
        );

        if (existingStepIndex !== -1) {
          if (newRenderedSteps[existingStepIndex].type !== currentStepData.type) {
            newRenderedSteps[existingStepIndex] = currentStepData;
          }

          if(currentStepData.type === 'merge') {
            if(currentStepData.parent === 'left') {
              // console.log('before merge: ' + JSON.stringify(newRenderedSteps[existingStepIndex-1], null, 2));

              newRenderedSteps[existingStepIndex-1].left = currentStepData.result;
              // console.log('after merge: ' + JSON.stringify(newRenderedSteps[existingStepIndex-1], null, 2));

            }
            else if(currentStepData.parent === 'right') {
              newRenderedSteps[existingStepIndex-1].right = currentStepData.result;
            }
          }
        } else {
          newRenderedSteps.push(currentStepData);
        }

        return newRenderedSteps;
      });
    };

    if (currentStep < steps.length) {
      renderSteps();
    }
  }, [steps, currentStep])

  const handleGenerateArray = () => {
    setArray(generateRandomArray(5));
    setCurrentStep(0);
    setRenderedSteps([]);
    setDisplayArray(1);
  };

  const handleStartMergeSort = () => {
    const animations: Step[] = [];
    mergeSort(array.slice(), 0, animations);
    setSteps(animations);
    setCurrentStep(0);
    setRenderedSteps([]);
    setIsAutoPlay(true); // Automatically start the animation
  };
  //Merge Sort 
  const mergeSort = (arr: number[], level: number, animations: Step[], parent = 'top') => {
    if (arr.length <= 1) {
      // animations.push({ type: 'base', array: arr.slice(), level });
      return arr;
    }
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    
    const right = arr.slice(mid);

    if (arr.length == 10){
    animations.push({ type: 'split', left: left.slice(), right: right.slice(), level, parent: parent });
    } else{
    animations.push({ type: 'split', left: left.slice(), right: right.slice(), level, parent: parent });

    }

    const merged = merge(mergeSort(left, level + 1, animations, 'left'), mergeSort(right, level + 1, animations, 'right'), level, animations, parent);
    animations.push({ type: 'merge', result: merged.slice(), level, parent});
    console.log(animations);
    return merged;
  };

  //Merge 2 arrays
  const merge = (left: number[], right: number[], level: number, animations: Step[], parent: string) => {
    const result: number[] = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      animations.push({ type: 'compare', leftIndex: i, rightIndex: j, level, left, right, parent });
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

  const renderArray = (arr: number[], highlightIndices: number[] = [], level: number, direction?: string, type?:string) => {
    // const x = direction === 'left' ? -level * 50 : level * 50;
    // const y = -level * 50;
    return (
    <div className="flex space-x-2" > 
    
      {arr.map((value, index) => (
        
        <motion.div
          // animate={{ x, y }}
          key={`${level}-${index}-${direction}`}
          className={`text-center border-2 p-3 rounded ${highlightIndices.includes(index) ? 'border-yellow-500' : (type === 'merge' ? 'border-green-500' : 'border-grey-500')} text-white `}
        >
          {value}
        </motion.div>
      ))}
    </div>)
};

  const renderStep = (step: Step) => {
    if (step.type === 'split') {
      return (
        <div className="flex flex-row items-center mt-4">
          <div className='text-white'>splitting</div>
          {renderArray(step.left!, [step.leftIndex!], step.level, 'left')}
          <div className='p-4'>          </div> 
          {renderArray(step.right!, [step.rightIndex!], step.level, 'right')}
        </div>
      );
    }
    
    else if (step.type === 'compare') {
      return (
        <div className="flex flex-row items-center mt-4">
          <div className='text-white'>Comparing</div>
          {renderArray(step.left!, [step.leftIndex!], step.level)}
          <div className='p-4'>          </div> 
          {renderArray(step.right!, [step.rightIndex!], step.level)}
        </div>
      );
    } else if (step.type === 'merge') {
      return (
        <div className="flex flex-row items-center mt-4">
          <div className='text-white'>Merging</div>
          {renderArray(step.result!,[], step.level, '', 'merge')}
        </div>
      );
    }
  };
  console.log('steps: ', steps);



  return (
    <div>
      <button
        className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mt-3 mr-3"
        onClick={handleGenerateArray}
      >
        Generate Array
      </button>
      <button
        className="flex-1 bg-purple-800 text-white font-semibold p-2 rounded hover:bg-purple-900 mb-3 mt-3"
        onClick={handleStartMergeSort}
      >
        Start Merge Sort
      </button>

      {displayArray && (
          <div className="flex flex-col items-center mt-4">
            <div className="flex space-x-2">
              {array.map((value, index) => (
                <div
                  key={index}
                  className="text-center border-2 p-3 rounded border-grey-500 text-white"
                >
                  {value}
                </div>
                
              ))}
            </div>
          </div>
        )
      }
      <AnimatePresence>
        {renderedSteps.map((step, index) => (
          <motion.div
            // key={index}
            key={`${step.level}-${step.type}-${index}`}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            
            transition={{ duration: 1 }}
          >
            {renderStep(step)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MergeSortVisualizer;
