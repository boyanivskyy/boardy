"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useOthers, useSelf } from "@liveblocks/react";
import { UserAvatar } from "./user-avatar";
import { connectionIdToColor } from "@/lib/utils";

const MAX_SHOWN_OTHER_USERS = 2;

export const Participants = () => {
	const users = useOthers();
	const currentUser = useSelf();

	const hasMoreUsers = users.length > MAX_SHOWN_OTHER_USERS;

	return (
		<div
			className="absolute h-12 top-2 right-2 bg-white 
					   rounded-md p-3 flex items-center shadow-md"
		>
			<div className="flex gap-x-2">
				{users
					.slice(0, MAX_SHOWN_OTHER_USERS)
					.map(({ connectionId, info }) => (
						<UserAvatar
							key={connectionId}
							src={info.picture}
							name={info.name}
							fallback={info?.name?.[0] || "A"}
							borderColor={connectionIdToColor(connectionId)}
						/>
					))}
				{currentUser && (
					<UserAvatar
						src={currentUser.info.picture}
						name={`${currentUser.info.name} (You)`}
						fallback={currentUser.info?.name?.[0] || "You"}
						borderColor={connectionIdToColor(
							currentUser.connectionId
						)}
					/>
				)}

				{hasMoreUsers && (
					<UserAvatar
						name={`${users.length - MAX_SHOWN_OTHER_USERS} more`}
						fallback={`+${users.length - MAX_SHOWN_OTHER_USERS}`}
						borderColor="#000000"
					/>
				)}
			</div>
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
