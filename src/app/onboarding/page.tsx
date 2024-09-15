"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight } from "lucide-react";

type FormData = {
	name: string;
	gender: string;
	accessibilityOptions: string[];
};

const initialFormData: FormData = {
	name: "",
	gender: "",
	accessibilityOptions: [],
};

export default function OnboardingForm() {
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState<FormData>(initialFormData);

	const updateFormData = (field: keyof FormData, value: string | string[]) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleAccessibilityOptionChange = (option: string) => {
		setFormData((prev) => ({
			...prev,
			accessibilityOptions: prev.accessibilityOptions.includes(option)
				? prev.accessibilityOptions.filter((item) => item !== option)
				: [...prev.accessibilityOptions, option],
		}));
	};

	const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
	const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Form submitted:", formData);
		// Here you would typically send the data to your backend
	};

	return (
		<div className="w-full max-w-2xl mx-auto p-6 space-y-8">
			<div className="space-y-2 text-center">
				<h1 className="text-3xl font-bold">Welcome To Onboarding!</h1>
				<p className="text-muted-foreground">Let's get to know you better</p>
			</div>

			<div className="flex justify-between mb-4">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className={`w-1/3 h-2 rounded-full ${
							i <= step ? "bg-primary" : "bg-muted"
						}`}
					/>
				))}
			</div>

			<form onSubmit={handleSubmit} className="space-y-8">
				{step === 1 && (
					<div className="space-y-4">
						<h2 className="text-2xl font-semibold">Step 1: Your Name</h2>
						<div className="space-y-2">
							<Label htmlFor="name">Full Name</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) => updateFormData("name", e.target.value)}
								placeholder="Enter your full name"
								required
							/>
						</div>
					</div>
				)}

				{step === 2 && (
					<div className="space-y-4">
						<h2 className="text-2xl font-semibold">Step 2: Gender</h2>
						<RadioGroup
							value={formData.gender}
							onValueChange={(value) => updateFormData("gender", value)}
							className="space-y-2"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="male" id="male" />
								<Label htmlFor="male">Male</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="female" id="female" />
								<Label htmlFor="female">Female</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="non-binary" id="non-binary" />
								<Label htmlFor="non-binary">Non-binary</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
								<Label htmlFor="prefer-not-to-say">Prefer not to say</Label>
							</div>
						</RadioGroup>
					</div>
				)}

				{step === 3 && (
					<div className="space-y-4">
						<h2 className="text-2xl font-semibold">Step 3: Accessibility Options</h2>
						<div className="space-y-2">
							{[
								"Dyslexia",
								"Color blindness",
								"Screen reader",
								"Keyboard navigation",
							].map((option) => (
								<div key={option} className="flex items-center space-x-2">
									<Checkbox
										id={option}
										checked={formData.accessibilityOptions.includes(option)}
										onCheckedChange={() =>
											handleAccessibilityOptionChange(option)
										}
									/>
									<Label htmlFor={option}>{option}</Label>
								</div>
							))}
						</div>
					</div>
				)}

				<div className="flex justify-between">
					{step > 1 && (
						<Button type="button" onClick={handlePrev} variant="outline">
							<ArrowLeft className="mr-2 h-4 w-4" /> Previous
						</Button>
					)}
					{step < 3 ? (
						<Button type="button" onClick={handleNext} className="ml-auto">
							Next <ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					) : (
						<Button type="submit" className="ml-auto">
							Complete
						</Button>
					)}
				</div>
			</form>
		</div>
	);
}
