"use client";

import { About } from "@/components/About";
import { Features } from "@/components/Features";
import { Hero } from "@/components/Hero";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Team } from "@/components/Team";
import "./landing.css";

const App = () => {
	return (
		<>
			<Hero />
			<About />
			<Features />

			<Team />
			{/* <Newsletter /> */}
			{/* <Footer /> */}
			<ScrollToTop />
		</>
	);
};

export default App;
