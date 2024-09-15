"use client";
import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Prevent rendering until after the component has mounted on the client
	if (!mounted) {
		return null;
	}

	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
