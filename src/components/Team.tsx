import { buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Facebook, Instagram, Linkedin } from "lucide-react";

interface TeamProps {
	imageUrl: string;
	name: string;
	position: string;
	socialNetworks: SociaNetworkslProps[];
}

interface SociaNetworkslProps {
	name: string;
	url: string;
}

const teamList: TeamProps[] = [
	{
		imageUrl:
			"https://media.licdn.com/dms/image/D4E03AQEtxbmkTWawBw/profile-displayphoto-shrink_200_200/0/1718212063544?e=2147483647&v=beta&t=zfTHOjMifK-_qmwP2IjkrhyeRQXVtN8XjAmB-dRxWXQ",
		name: "Michael-Andre Odusami",
		position: "",
		socialNetworks: [
			{
				name: "Linkedin",
				url: "https://www.linkedin.com/in/odusami03/",
			},
		],
	},
	{
		imageUrl:
			"https://media.licdn.com/dms/image/v2/D4E03AQHFfKH8ibmAeA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1694751959826?e=1732147200&v=beta&t=-G-H6O-Kn3Bxt28LB5LVswYyK-ExyUtnwYux3XdEtm8",
		name: "Dhruv Varshney",
		position: "",
		socialNetworks: [
			{
				name: "Linkedin",
				url: "https://www.linkedin.com/in/dhruvvarshneyvk/",
			},
		],
	},
	{
		imageUrl:
			"https://media.licdn.com/dms/image/v2/C5603AQFUQlHDeaSXyQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1654603923939?e=1732147200&v=beta&t=RV3YW73nE0VqJHZHcghAO2Zm7Ncqn1x0q7WDBBFXnLA",
		name: "Aditya Singh",
		position: "",
		socialNetworks: [
			{
				name: "Linkedin",
				url: "https://www.linkedin.com/in/singh-aditya23/",
			},
		],
	},
	{
		imageUrl:
			"https://media.licdn.com/dms/image/v2/D5603AQGUVgCxw8bPZA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1722503948777?e=1732147200&v=beta&t=WUMOd7c1XZm9kK4aIHrE1k3xegFDlfrwYkiby7Av1uU",
		name: "Siddharth Rakshit",
		position: "",
		socialNetworks: [
			{
				name: "Linkedin",
				url: "https://www.linkedin.com/in/siddharth-rakshit-04044b231//",
			},
		],
	},
];

export const Team = () => {
	const socialIcon = (iconName: string) => {
		switch (iconName) {
			case "Linkedin":
				return <Linkedin size="20" />;

			case "Facebook":
				return <Facebook size="20" />;

			case "Instagram":
				return <Instagram size="20" />;
		}
	};

	return (
		<section id="team" className="container py-24 sm:py-32">
			<h2 className="text-3xl md:text-4xl font-bold text-center">
				<span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
					THE{" "}
				</span>
				TEAM
			</h2>

			<p className="mt-4 mb-10 text-xl text-muted-foreground text-center">
				Take a look at who developed this amazing product!
			</p>

			<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-10">
				{teamList.map(({ imageUrl, name, position, socialNetworks }: TeamProps) => (
					<Card
						key={name}
						className="bg-muted/50 relative mt-8 flex flex-col justify-center items-center"
					>
						<CardHeader className="mt-8 flex justify-center items-center pb-2">
							<img
								src={imageUrl}
								alt={`${name} ${position}`}
								className="absolute -top-12 rounded-full w-24 h-24 aspect-square object-cover"
							/>
							<CardTitle className="text-center">{name}</CardTitle>
							<CardDescription className="text-primary">{position}</CardDescription>
						</CardHeader>

						<CardContent className="text-center pb-2">
							<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
						</CardContent>

						<CardFooter>
							{socialNetworks.map(({ name, url }: SociaNetworkslProps) => (
								<div key={name}>
									<a
										rel="noreferrer noopener"
										href={url}
										target="_blank"
										className={buttonVariants({
											variant: "ghost",
											size: "sm",
										})}
									>
										<span className="sr-only">{name} icon</span>
										{socialIcon(name)}
									</a>
								</div>
							))}
						</CardFooter>
					</Card>
				))}
			</div>
		</section>
	);
};
