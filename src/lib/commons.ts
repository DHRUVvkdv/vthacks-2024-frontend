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
		href: "/",
		label: "Explorer",
	},
	{
		href: "/planner",
		label: "MyPlanner",
	},
];
