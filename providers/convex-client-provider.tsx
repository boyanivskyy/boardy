"use client";

import { Loading } from "@/components/auth/loading";
import { ClerkProvider, SignInButton, useAuth } from "@clerk/nextjs";
import {
	AuthLoading,
	Authenticated,
	ConvexReactClient,
	Unauthenticated,
} from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

interface ConvexClientProviderProps {
	children: React.ReactNode;
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
const convex = new ConvexReactClient(convexUrl);

export const ConvexClientProvider = ({
	children,
}: ConvexClientProviderProps) => {
	return (
		<ClerkProvider>
			<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
				<Authenticated>{children}</Authenticated>
				<Unauthenticated>
					{/* TODO: Why am I not redirected to another URL to authenticate */}
					Unauthenticated
					<SignInButton />
				</Unauthenticated>
				<AuthLoading>
					<Loading />
				</AuthLoading>
			</ConvexProviderWithClerk>
		</ClerkProvider>
	);
};
