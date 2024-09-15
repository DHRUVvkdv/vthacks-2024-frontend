"use client";
import { Label } from "@radix-ui/react-label";
import { useState, useEffect } from "react";

interface TypingLabelProps {
	fullText: string;
}

const TypingLabel = ({ fullText }: TypingLabelProps) => {
	const words = fullText.split(" "); // Split text by words
	const [displayedText, setDisplayedText] = useState("");
	const [wordIndex, setWordIndex] = useState(0);

	useEffect(() => {
		if (wordIndex < words.length) {
			const timer = setTimeout(() => {
				setDisplayedText((prev) => prev + (prev ? " " : "") + words[wordIndex]);
				setWordIndex(wordIndex + 1);
			}, 80); // Adjust delay as needed

			return () => clearTimeout(timer);
		}
	}, [wordIndex, words]);

	return (
		<Label htmlFor="query" className="font-bold text-xl">
			{displayedText}
		</Label>
	);
};

export default TypingLabel;
