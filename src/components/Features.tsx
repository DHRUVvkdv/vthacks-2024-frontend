import { Badge } from "./ui/badge";

import { Link } from "lucide-react";
import { CardContainer, CardBody, CardItem } from "./ui/3d-card";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";

interface FeatureProps {
	title: string;
	description: string;
	image: string;
}

const features: FeatureProps[] = [
	{
		title: "Multi-Dimensional Reviews",
		description:
			"From cleanliness to local attractions, our platform provides reviews across various categories so you can make informed decisions",
		image: "https://static01.nyt.com/images/2024/03/10/nyregion/10nyc-comeback-01-czlv/00nyc-comeback-01-czlv-videoSixteenByNine3000.jpg",
	},
	{
		title: "Traveler Insights",
		description:
			"Gain real insights from fellow travelers and locals, offering you a firsthand look at the destinations before you visit.",
		image: "https://static01.nyt.com/images/2024/03/10/nyregion/10nyc-comeback-01-czlv/00nyc-comeback-01-czlv-videoSixteenByNine3000.jpg",
	},
	{
		title: "Custom Ratings by Category",
		description:
			"Get detailed ratings across key aspects like ambiance, hospitality, food quality, and accessibility.",
		image: "https://static01.nyt.com/images/2024/03/10/nyregion/10nyc-comeback-01-czlv/00nyc-comeback-01-czlv-videoSixteenByNine3000.jpg",
	},
];

const featureList: string[] = [
	"Dark/Light theme",
	"Reviews",
	"Features",
	"Pricing",
	"Contact form",
	"Our team",
	"Responsive design",
	"Newsletter",
	"Minimalist",
];

export const Features = () => {
	return (
		<section id="features" className="container py-20 sm:py-32 space-y-8">
			<h2 className="text-3xl lg:text-4xl font-bold md:text-center">
				Many{" "}
				<span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
					Great Features
				</span>
			</h2>

			{/* badges of all features */}
			<div className="flex flex-wrap md:justify-center gap-4">
				{featureList.map((feature: string) => (
					<div key={feature}>
						<Badge variant="secondary" className="text-sm">
							{feature}
						</Badge>
					</div>
				))}
			</div>

			{/* old card containers */}
			{/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, image }: FeatureProps) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>{description}</CardContent>

            <CardFooter>
              <img
                src={image}
                alt="About feature"
                className="w-[200px] lg:w-[300px] mx-auto"
              />
            </CardFooter>
          </Card>
        ))}
      </div> */}

			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{features.map(({ title, description, image }: FeatureProps) => (
					<Card key={title}>
						<CardHeader>
							<CardTitle>{title}</CardTitle>
						</CardHeader>

						<CardContent className="min-h-28">{description}</CardContent>

						<CardFooter>
							<img
								src={image}
								alt="About feature"
								className="w-[200px] lg:w-[300px] mx-auto"
							/>
						</CardFooter>
					</Card>
				))}
			</div>
		</section>
	);
};
