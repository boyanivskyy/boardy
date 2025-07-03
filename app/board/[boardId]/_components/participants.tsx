"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const Participants = () => {
	return (
		<div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md">
			List of users
		</div>
	);
};

export function ParticipantsSkeleton() {
	return (
		<div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md min-w-[200px]">
			<Skeleton className="h-full w-full bg-muted" />
		</div>
	);
}
