"use client";
import { useUser } from "@propelauth/nextjs/client";

const FakeProfilePage = () => {
	const { user } = useUser();

	if (user) {
		return (
			<div>
				<h1>{user.email}</h1>
				<h2>{user.userId}</h2>
			</div>
		);
	}

	return <div>No User</div>;
};

export default FakeProfilePage;
