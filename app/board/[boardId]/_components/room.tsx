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
	// publicApiKey="pk_dev_elOX6L-GoG-ZXyhM1HfbrPld58hDVcYCXLfPUi2xzm_1CNCXS0YPAAYf4eUpY5mG"

	return (
		<LiveblocksProvider authEndpoint="/api/liveblocks-auth" throttle={16}>
			<RoomProvider
				id={roomId}
				initialPresence={{ cursor: null, selection: [] }}
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
