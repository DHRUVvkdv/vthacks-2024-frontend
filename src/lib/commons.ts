export interface RouteProps {
	href: string;
	label: string;
}

export const routeList: RouteProps[] = [
	{
		href: "/home",
		label: "Home",
	},
	{
		href: "/explorer",
		label: "Explorer",
	},
	{
		href: "/planner",
		label: "MyPlanner",
	},
];

export interface UserProfileFormData {
	gender: "string";
	age: 0;
	email: "string";
	user_name: "string";
	mobility: object;
	cognitive: object;
	hearing: object;
	vision: object;
	LGBTQ: true;
	other: object;
}
