import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Settings({ isOpen, onClose, buttonRef }) {
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [isLargeText, setIsLargeText] = useState(false);
	const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

	useEffect(() => {
		// Apply settings (same as before)
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}

		if (isLargeText) {
			document.documentElement.classList.add("text-lg");
		} else {
			document.documentElement.classList.remove("text-lg");
		}

		if (isVoiceEnabled) {
			console.log("Voice dictation enabled");
		} else {
			console.log("Voice dictation disabled");
		}
	}, [isDarkMode, isLargeText, isVoiceEnabled]);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.2 }}
					className="absolute right-0 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 overflow-hidden"
					style={{
						top: buttonRef.current
							? buttonRef.current.offsetHeight + buttonRef.current.offsetTop + 10
							: 0,
						width: "240px", // Increased width for better layout
					}}
				>
					<div className="p-4">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-medium text-gray-900 dark:text-white">
								Settings
							</h3>
							<button
								onClick={onClose}
								className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-700 dark:text-gray-200">
									Dark Mode
								</span>
								<label className="switch">
									<input
										type="checkbox"
										checked={isDarkMode}
										onChange={() => setIsDarkMode(!isDarkMode)}
									/>
									<span className="slider round"></span>
								</label>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-700 dark:text-gray-200">
									Large Text
								</span>
								<label className="switch">
									<input
										type="checkbox"
										checked={isLargeText}
										onChange={() => setIsLargeText(!isLargeText)}
									/>
									<span className="slider round"></span>
								</label>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-700 dark:text-gray-200">
									Voice Dictation
								</span>
								<label className="switch">
									<input
										type="checkbox"
										checked={isVoiceEnabled}
										onChange={() => setIsVoiceEnabled(!isVoiceEnabled)}
									/>
									<span className="slider round"></span>
								</label>
							</div>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
