"use client";
import { useState, useRef } from "react";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Button, buttonVariants } from "./ui/button";
import { LogOut, Menu, User } from "lucide-react";
import { routeList, RouteProps } from "@/lib/commons";
import Link from "next/link";

import { ModeToggle } from "./mode-toggle";
import Settings from "./Settings";
import { useUser, useRedirectFunctions, useLogoutFunction } from "@propelauth/nextjs/client";
import { Home, Compass, Calendar } from "lucide-react"; // Import Lucide icons

export const Navbar = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const settingsButtonRef = useRef(null);

	const { user } = useUser();
	const { redirectToLoginPage } = useRedirectFunctions();
	const logoutFn = useLogoutFunction();

	return (
		<header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
			<NavigationMenu className="mx-auto">
				<NavigationMenuList className="container h-14 px-4 w-screen flex justify-between items-center">
				<NavigationMenuItem className="font-bold flex">
						<Link
							rel="noreferrer noopener"
							href={routeList[0].href}
							className="ml-2 text-3xl flex font-['Open_Sans'] font-extrabold"
						>
							<span>map</span>
							<span className="text-[#ee5c26]">ability</span>
						</Link>
					</NavigationMenuItem>

					{/* desktop */}
					<nav className="hidden md:flex items-end justify-end gap-2">
						{routeList.map((route: RouteProps, i) => (
							<Link
								rel="noreferrer noopener"
								href={route.href}
								key={i}
								className={`text-[17px] ${buttonVariants({
									variant: "ghost",
								})}`}
							>
								{route.label}
							</Link>
						))}
					</nav>

					<div className="hidden md:flex items-right gap-2">
						<ModeToggle />

						{/* Settings icon */}
						<button
							ref={settingsButtonRef}
							className="text-gray-600 hover:text-gray-800 focus:outline-none settings-icon"
							onClick={() => setIsSettingsOpen(!isSettingsOpen)}
							aria-label="Open settings"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
						</button>

						{/* Conditional rendering based on login status */}
						{user ? (
							<>
								<Link href="/profile">
									<Button variant="ghost" size="icon">
										<User className="h-[1.2rem] w-[1.2rem]" />
										<span className="sr-only">Profile</span>
									</Button>
								</Link>
								<Button
									onClick={logoutFn}
									className={`border ${buttonVariants({ variant: "secondary" })}`}
								>
									Logout
								</Button>
							</>
						) : (
							<Button
								onClick={() => redirectToLoginPage()}
								className={`border ${buttonVariants({ variant: "secondary" })}`}
							>
								Login
							</Button>
						)}
					</div>

					{/* mobile */}
					<span className="flex flex-col md:hidden">
						<ModeToggle />

						<Sheet open={isOpen} onOpenChange={setIsOpen}>
							<SheetTrigger className="px-2">
								<Menu
									className="flex md:hidden h-5 w-5"
									onClick={() => setIsOpen(true)}
								>
									<span className="sr-only">Menu Icon</span>
								</Menu>
							</SheetTrigger>

							{/* Sidebar content */}
							<SheetContent side={"left"} className="w-28">
								{" "}
								{/* Narrower sidebar */}
								<div className="space-y-6 text-center flex flex-col items-center justify-center">
									<Link href="/home" className="block p-2">
										<Home className="w-full h-full" /> {/* Large Home icon */}
										<span>Home</span>
									</Link>
									<Link href="/" className="block p-2">
										<Compass className="w-full h-full" /> <span>Explorer</span>
										{/* Large Explorer icon */}
									</Link>
									<Link href="/planner" className="block p-2">
										<Calendar className="w-full h-full" /> <span>Planner</span>
										{/* Large AI Day Planner icon */}
									</Link>
									<Link href="/profile" className="block p-2">
										<User className="w-full h-full" /> <span>Profile</span>
										{/* Large Profile icon */}
									</Link>

									{user ? (
										<>
											<Button
												onClick={logoutFn}
												className="border block w-full text-center mt-auto p-2"
											>
												<LogOut className="w-full h-full" />
											</Button>
										</>
									) : (
										<Button
											onClick={() => redirectToLoginPage}
											className="border block w-full text-center"
										>
											Login
										</Button>
									)}
								</div>
							</SheetContent>
						</Sheet>
					</span>
				</NavigationMenuList>
			</NavigationMenu>

			{/* Add the Settings component */}
			<Settings
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
				buttonRef={settingsButtonRef}
			/>
		</header>
	);
};
