"use client";

import { ReactNode } from "react";
import { ClientSideSuspense } from "@liveblocks/react";

import { LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { Layer } from "@/types/canvas";

interface RoomProps {
	children: ReactNode;
	roomId: string;
	fallback: NonNullable<ReactNode> | null;
}

export const Room = ({ children, roomId, fallback }: RoomProps) => {
	return (
		<LiveblocksProvider authEndpoint="/api/liveblocks-auth" throttle={16}>
			<RoomProvider
				id={roomId}
				initialPresence={{
					cursor: null,
					selection: [],
					pencilDraft: null,
					penColor: null,
				}}
				initialStorage={{
					layers: new LiveMap<string, LiveObject<Layer>>(),
					layerIds: new LiveList([]),
				}}
			>
				<ClientSideSuspense fallback={fallback}>
					{() => children}
				</ClientSideSuspense>
			</RoomProvider>
		</LiveblocksProvider>
	);
};
