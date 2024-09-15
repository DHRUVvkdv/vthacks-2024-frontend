import { Statistics } from "./Statistics";
import gpslogo from "@/app/gpslogo.webp";

export const About = () => {
	return (
		<section id="about" className="container py-24 sm:py-32">
			<div className="bg-muted/50 border rounded-lg py-12">
				<div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
					<img src={gpslogo} alt="" className="w-[300px] object-contain rounded-lg" />
					<div className="bg-green-0 flex flex-col justify-between">
						<div className="pb-6">
							<h2 className="text-3xl md:text-4xl font-bold">
								<span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
									About{" "}
								</span>
								Us
							</h2>
							<p className="text-xl text-muted-foreground mt-4">
								Mapability is on a mission to make travel accessible to everyone,
								regardless of their abilities. We combine AI-powered trip planning
								with a comprehensive Google Maps integration to create personalized,
								accessibility-focused itineraries. Our platform showcases a wide
								array of accessible locations, complete with detailed information on
								mobility, cognitive, hearing, and vision accommodations. What sets
								us apart is our community-driven approach – we empower users to
								share their experiences through reviews, helping others make
								informed decisions. With voice-enabled features and a commitment to
								inclusivity, AccessiTrip is more than a travel planner; we're a
								dedicated companion in your journey to explore the world confidently
								and joyfully.
							</p>
						</div>

						<Statistics />
					</div>
				</div>
			</div>
		</section>
	);
};
