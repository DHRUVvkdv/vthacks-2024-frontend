import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@propelauth/nextjs/client";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

const openDyslexic = localFont({
	src: "./fonts/OpenDyslexic-Regular.woff",
	variable: "--font-dyslexic-off",
	weight: "100 900",
});

export const metadata = {
	title: "Next.js Google Maps",
	description: "A Next.js application with Google Maps",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`  antialiased`}>
				<AuthProvider authUrl={process.env.NEXT_PUBLIC_AUTH_URL}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<Navbar />
						{children}
					</ThemeProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
