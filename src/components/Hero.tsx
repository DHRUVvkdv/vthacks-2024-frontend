import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Globe } from "./globe";
import { useAuth } from '@/context/AuthContext';

export const Hero = () => {
	const { isAuthenticated, signIn } = useAuth();

	const handleExplore = () => {
		redirect("/explorer");
	};

	return (
		<section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
			<div className="lg:text-start items-center text-center space-y-6">
				<div className="text-5xl md:text-6xl font-bold">
					<h1 className="inline text-50xl">
						<span className="inline font-['Open_Sans'] bg-clip-text">
							<span>map</span>
							<span className="text-[#E97451]">ability</span>
						</span>
					</h1>
				</div>

				<p className="text-2xl text-muted-foreground mx-auto lg:mx-0">
					Accessibility Mapped, Adventures Unlocked
				</p>

				<div className="space-y-4 md:space-y-0 md:space-x-4">
					{isAuthenticated ? (
						<>
							<Button className="w-full md:w-1/3 font-bold">
								<Link
									href="/explorer"
									className="block w-full h-full dark:text-white"
								>
									Explore
								</Link>
							</Button>
						</>
					) : (
						<>
							<Button
								className="w-full md:w-1/3 font-bold"
								onClick={signIn}
							>
								Begin
							</Button>
						</>
					)}

					<a
						rel="noreferrer noopener"
						href="https://github.com/modusami/vthacks-2024-frontend"
						target="_blank"
						className={`w-full md:w-1/3 ${buttonVariants({
							variant: "outline",
						})}`}
					>
						Github
						<GitHubLogoIcon className="ml-2 w-5 h-5" />
					</a>
				</div>
			</div>

			{/* Hero cards sections */}
			<div className="z-10">
				<Globe />
			</div>

			{/* Shadow effect */}
			<div className="shadow"></div>
		</section>
	);
};