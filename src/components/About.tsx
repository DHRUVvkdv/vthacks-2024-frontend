import { Statistics } from "./Statistics";
import gpslogo from "@/app/gpslogo.webp";

export const About = () => {
	return (
		<section id="about" className="container ">
			<div className="bg-muted/50 border rounded-lg py-12">
				<div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
					<img src={gpslogo} alt="" className="w-[300px] object-contain rounded-lg" />
					<div className="bg-green-0 flex flex-col justify-between">
						<div className="pb-6">
							<h2 className="text-3xl md:text-4xl font-bold">
								<span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
									Who we{" "}
								</span>
								are
							</h2>
							<p className="text-lg mt-4">
								Mapability is dedicated to making travel accessible for all. Our
								platform combines advanced AI technology with Google Maps
								integration to deliver personalized, accessibility-focused
								itineraries. Mapability empowers individuals to explore the world
								with confidence and ease.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
