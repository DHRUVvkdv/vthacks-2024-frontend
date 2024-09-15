"use client";

import { About } from "@/components/About";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Newsletter } from "@/components/Newsletter";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Team } from "@/components/Team";
import "./landing.css";

const App = () => {
	return (
		<>
			<Hero />
			<About />
			<Features />
			{/* <Team /> */}
			{/* <Newsletter /> */}
			{/* <Footer /> */}
			<ScrollToTop />
		</>
	);
};

export default App;
