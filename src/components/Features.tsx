import React from 'react';
import { Badge } from "./ui/badge";
import { Link } from "lucide-react";
import { CardContainer, CardBody, CardItem } from "./ui/3d-card";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import AccImage from "./AccExp.png";
import PlannerImage from "./MyPlanner.png"
import SettingsImage from "./Settings.png"
import { StaticImageData } from "next/image";
import { motion } from "framer-motion";

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
    <section id="features" className="container py-20 sm:py-32 space-y-12 bg-gradient-to-b from-background to-secondary/20">
      <motion.h2 
        className="text-3xl lg:text-4xl font-bold md:text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Many{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Great Features
        </span>
      </motion.h2>

      <motion.div 
        className="flex flex-wrap md:justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, staggerChildren: 0.1 }}
      >
        {featureList.map((feature: string) => (
          <motion.div 
            key={feature}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge variant="secondary" className="text-sm hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
              {feature}
            </Badge>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, staggerChildren: 0.2 }}
      >
        {features.map(({ title, description, image }: FeatureProps) => (
          <motion.div
            key={title}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">{title}</CardTitle>
              </CardHeader>

              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{description}</p>
              </CardContent>

              <CardFooter className="justify-center">
                <img
                  src={typeof image === 'string' ? image : image.src}
                  alt={`About ${title}`}
                  className="w-[200px] lg:w-[250px] mx-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                />
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};