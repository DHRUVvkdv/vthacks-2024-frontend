import { Badge } from "./ui/badge";
import { Link } from "lucide-react";
import { CardContainer, CardBody, CardItem } from "./ui/3d-card";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import AccImage from "./AccExp.png";
import PlannerImage from "./MyPlanner.png"
import SettingsImage from "./Settings.png"
import { StaticImageData } from "next/image";

interface FeatureProps {
  title: string;
  description: string;
  image: string | StaticImageData;
}

const features: FeatureProps[] = [
  {
    title: "Accessible Exploration",
    description:
      "This page showcases our key features designed to help users find, rate, and share information about accessible locations, empowering everyone to explore with confidence",
    image: AccImage,
  },
  {
    title: "Personalised Journey Planner",
    description:
	"Create your perfect trip with our AI-powered planner. We consider your unique needs, preferences, and accessibility requirements to craft a tailor-made itinerary",
    image: PlannerImage,
  },
  {
    title: "Accessibility on Your Fingertips",
    description:
      "From dyslexia-friendly text modes to customizable font sizes, we're committed to ensuring everyone can explore with ease and confidence",
    image: SettingsImage,
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

      <div className="flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge variant="secondary" className="text-sm">
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, image }: FeatureProps) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent className="min-h-28">{description}</CardContent>

            <CardFooter>
              <img
                src={typeof image === 'string' ? image : image.src}
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