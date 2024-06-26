import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MAX_STACK_ITEMS = 20;

const StackVisualizer: React.FC = () => {
	const [stack, setStack] = useState<string[]>([]);
	const [inputValue, setInputValue] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [inputError, setInputError] = useState<string>("");

	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => setError(""), 3000);
			return () => clearTimeout(timer);
		}
	}, [error]);

	useEffect(() => {
		if (inputError) {
			const timer = setTimeout(() => setInputError(""), 3000);
			return () => clearTimeout(timer);
		}
	}, [inputError]);

	const pushToStack = (element: string) => {
		if (!element) {
			setInputError("Enter element to push");
			return;
		}
		if (stack.length >= MAX_STACK_ITEMS) {
			setError("Stack is full (max 10 items)");
			return;
		}
		setStack([...stack, element]);
		setInputValue("");
		setInputError("");
	};

	const popFromStack = () => {
		if (stack.length > 0) {
			const updatedStack = stack.slice(0, -1);
			setStack(updatedStack);
		} else {
			setError("Cannot pop from an empty stack");
		}
	};

	const getTopElement = () => stack[stack.length - 1] || "Stack is empty";

	const clearStack = () => setStack([]);

	return (
		<div className="max-w-md w-full p-8 mx-auto bg-gray-800 rounded-lg shadow-lg">
			<h1 className="text-2xl text-white font-bold mb-6 text-center">
				Stack Visualizer
			</h1>
			<div className="mb-6">
				<input
					type="text"
					className={`w-full p-3 border-2 rounded mb-3 text-black bg-gray-100 ${
						inputError ? 'border-red-500' : ''
					}`}
					placeholder="Enter a value to push..."
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && pushToStack(inputValue)}

				/>
				{inputError && (
					<p className="text-red-500 text-sm mb-2">{inputError}</p>
				)}
				<div className="flex flex-row space-x-2">
					<button
						className="flex-1 bg-purple-600 text-white font-semibold p-2 rounded hover:bg-purple-700"
						onClick={() => pushToStack(inputValue)}
					>
						Push
					</button>
					<button
						className="flex-1 bg-red-600 text-white font-semibold p-2 rounded hover:bg-red-700"
						onClick={popFromStack}
					>
						Pop
					</button>
					<button
						className="flex-1 bg-blue-600 text-white font-semibold p-2 rounded hover:bg-blue-700"
						onClick={clearStack}
					>
						Clear
					</button>
				</div>
			</div>
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
					<span className="block sm:inline">{error}</span>
				</div>
			)}
			<div className="bg-gray-700 p-4 rounded-lg">
				<p className="mb-4 text-lg font-semibold text-white">
					Top Element: <span className="text-yellow-400">{getTopElement()}</span>
				</p>
				<div className="space-y-2">
					<AnimatePresence>
						{stack.slice().reverse().map((item, index) => (
							<motion.div
								key={`${item}-${stack.length - 1 - index}`}
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.2 }}
								className="border-2 text-center border-white rounded border-2 p-1 text-white"
							>
								{item}
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};

export default StackVisualizer;