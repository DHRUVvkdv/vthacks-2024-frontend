'use client';

import { useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { About } from "@/components/About";
import { Features } from "@/components/Features";
import { Hero } from "@/components/Hero";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Team } from "@/components/Team";

const App = () => {
	const { isAuthenticated } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		// If user is authenticated and there's a redirect parameter, navigate to that page
		const redirectPath = searchParams.get('redirect');
		if (isAuthenticated && redirectPath) {
			router.push(redirectPath);
		}
	}, [isAuthenticated, router, searchParams]);

	return (
		<>
			<Hero />
			<About />
			<Features />
			<Team />
			<ScrollToTop />
		</>
	);
};

export default App;