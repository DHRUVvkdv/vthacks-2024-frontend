import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Globe } from "lucide-react";
import gpslogo from "@/app/gpslogo.webp";

export const About = () => {
	return (
		<section id="about" className="container py-12 md:py-24">
			<Card className="overflow-hidden">
				<CardContent className="p-0">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
						<div className="relative h-[300px] md:h-full">
							<Image
								src={gpslogo}
								alt="Mapability Logo"
								layout="fill"
								objectFit="cover"
								className="rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
							/>
						</div>
						<div className="p-6 md:p-8 flex flex-col justify-between">
							<div>
								<Badge variant="outline" className="mb-2">
									About Us
								</Badge>
								<CardTitle className="text-3xl md:text-4xl font-bold mb-4">
									<span className="bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
										Who We Are
									</span>
								</CardTitle>
								<p className="text-lg text-muted-foreground mb-6">
									Mapability is dedicated to making travel accessible for all. Our
									platform combines advanced AI technology with Google Maps
									integration to deliver personalized, accessibility-focused
									itineraries. We empower individuals to explore the world with
									confidence and ease.
								</p>
							</div>
							<div className="grid grid-cols-3 gap-4 text-center">
								<div>
									<MapPin className="h-8 w-8 mb-2 mx-auto text-primary" />
									<h3 className="font-semibold">200+</h3>
									<p className="text-sm text-muted-foreground">Locations</p>
								</div>
								<div>
									<Users className="h-8 w-8 mb-2 mx-auto text-primary" />
									<h3 className="font-semibold">10k+</h3>
									<p className="text-sm text-muted-foreground">Users</p>
								</div>
								<div>
									<Globe className="h-8 w-8 mb-2 mx-auto text-primary" />
									<h3 className="font-semibold">10+</h3>
									<p className="text-sm text-muted-foreground">Acessibilities</p>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	);
};
