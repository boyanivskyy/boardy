"use client";

import { memo } from "react";

import {
	shallow,
	useOthersConnectionIds,
	useOthersMapped,
} from "@liveblocks/react";
import { Cursor } from "./cursor";
import { Path } from "./path";
import { colorToCSS } from "@/lib/utils";

const Drafts = () => {
	const others = useOthersMapped(
		(other) => ({
			pencilDraft: other.presence.pencilDraft,
			penColor: other.presence.penColor,
		}),
		shallow
	);

	return (
		<>
			{others.map(([key, other]) => {
				if (other.pencilDraft) {
					return (
						<Path
							key={key}
							x={0}
							y={0}
							points={other.pencilDraft}
							fill={
								other.penColor
									? colorToCSS(other.penColor)
									: "#000"
							}
						/>
					);
				}

				return null;
			})}
		</>
	);
};

const Cursors = () => {
	const ids = useOthersConnectionIds();

	return (
		<>
			{ids.map((connectionId) => (
				<Cursor key={connectionId} connectionId={connectionId} />
			))}
		</>
	);
};

export const CursorsPresence = memo(() => {
	return (
		<>
			<Drafts />
			<Cursors />
		</>
	);
});

CursorsPresence.displayName = "CursorsPresence";
