import React from "react";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Globe } from "lucide-react";
import gpslogo from "@/app/gpslogo.webp";

export const About = () => {
	return (
		<section id="about" className="container py-12 md:py-24">
			<Card className="overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
				<CardContent className="p-0">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
						<div className="relative h-[300px] md:h-full overflow-hidden">
							<Image
								src={gpslogo}
								alt="Mapability Logo"
								layout="fill"
								objectFit="cover"
								className="rounded-t-lg md:rounded-l-lg md:rounded-tr-none transition-transform duration-500 hover:scale-110"
							/>
						</div>
						<div className="p-6 md:p-8 flex flex-col justify-between">
							<div>
								<Badge variant="outline" className="mb-2 animate-pulse">
									About Us
								</Badge>
								<CardTitle className="text-3xl md:text-4xl font-bold mb-4">
									<span className="bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text animate-gradient">
										Who We Are
									</span>
								</CardTitle>
								<p className="text-lg text-muted-foreground mb-6 animate-fadeIn">
									Mapability is dedicated to making travel accessible for all. Our
									platform combines advanced AI technology with Google Maps
									integration to deliver personalized, accessibility-focused
									itineraries. We empower individuals to explore the world with
									confidence and ease.
								</p>
							</div>
							<div className="grid grid-cols-3 gap-4 text-center">
								{[
									{ icon: MapPin, label: "Locations", value: "200+" },
									{ icon: Users, label: "Users", value: "10k+" },
									{ icon: Globe, label: "Acessibilities", value: "10+" },
								].map((item, index) => (
									<div
										key={item.label}
										className={`animate-fadeInUp animation-delay-${index}`}
									>
										<item.icon className="h-8 w-8 mb-2 mx-auto text-primary transition-transform duration-300 hover:scale-125" />
										<h3 className="font-semibold">{item.value}</h3>
										<p className="text-sm text-muted-foreground">
											{item.label}
										</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	);
};

// Add these styles to your global CSS file or a separate CSS module
// Commenting beacuse frontend never used it
// const styles = `
// @keyframes gradient {
//   0% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
//   100% { background-position: 0% 50%; }
// }

// .animate-gradient {
//   background-size: 200% 200%;
//   animation: gradient 3s ease infinite;
// }

// @keyframes fadeIn {
//   from { opacity: 0; }
//   to { opacity: 1; }
// }

// .animate-fadeIn {
//   animation: fadeIn 1s ease-out;
// }

// @keyframes fadeInUp {
//   from { 
//     opacity: 0;
//     transform: translateY(20px);
//   }
//   to { 
//     opacity: 1;
//     transform: translateY(0);
//   }
// }

// .animate-fadeInUp {
//   animation: fadeInUp 0.5s ease-out forwards;
// }

// .animation-delay-0 { animation-delay: 0s; }
// .animation-delay-1 { animation-delay: 0.2s; }
// .animation-delay-2 { animation-delay: 0.4s; }
// `;
