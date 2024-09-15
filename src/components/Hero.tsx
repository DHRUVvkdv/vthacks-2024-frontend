import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import { HeroCards } from "./HeroCards";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useRedirectFunctions } from "@propelauth/nextjs/client";

export const Hero = () => {
	const { redirectToSignupPage } = useRedirectFunctions();
	return (
		<section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
			<div className="text-center lg:text-start space-y-6">
				<div className="text-5xl md:text-6xl font-bold">
					<h1 className="inline">
						<span className="inline bg-gradient-to-r from-[#E97451]  to-[#d25c47] text-transparent bg-clip-text ">
							Accessibility Mapped, Adventures Unlocked
						</span>
					</h1>{" "}
					{/* <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              APP NAME
            </span>
          </h2> */}
				</div>

				<p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
					Explore, Experience, and Share the Best Places with In-Depth Reviews & Ratings
					Across Categories
				</p>

				<div className="space-y-4 md:space-y-0 md:space-x-4">
					<Button
						className="w-full md:w-1/3 text-black font-black"
						onClick={(e) => redirectToSignupPage()}
					>
						Start Your Journey
					</Button>

					<a
						rel="noreferrer noopener"
						href="https://github.com/modusami/vthacks-2024-frontend"
						target="_blank"
						className={`w-full md:w-1/3 ${buttonVariants({
							variant: "outline",
						})}`}
					>
						Github Repository
						<GitHubLogoIcon className="ml-2 w-5 h-5" />
					</a>
				</div>
			</div>

			{/* Hero cards sections */}
			<div className="z-10">
				<HeroCards />
			</div>

			{/* Shadow effect */}
			<div className="shadow"></div>
		</section>
	);
};
