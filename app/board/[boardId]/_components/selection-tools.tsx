"use client";

import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { Camera, Color } from "@/types/canvas";
import { useMutation, useSelf } from "@liveblocks/react";
import { memo } from "react";
import { ColorPicker } from "./color-picker";
import { useDeleteLayers } from "@/hooks/use-delete-layers";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { BringToFront, SendToBack, Trash2 } from "lucide-react";

interface SelectionToolsProps {
	camera: Camera;
	setLastUsedColor: (color: Color) => void;
}

export const SelectionTools = memo(
	({ camera, setLastUsedColor }: SelectionToolsProps) => {
		const selection = useSelf((me) => me.presence.selection);

		const moveToBack = useMutation(
			({ storage }) => {
				const ids = storage.get("layerIds");
				const indicies: number[] = [];

				const arr = ids.toImmutable();

				for (let i = 0; i < arr.length; i++) {
					if (selection?.includes(arr[i])) {
						indicies.push(i);
					}
				}

				for (let i = 0; i < indicies.length; i++) {
					ids.move(indicies[i], i);
				}
			},
			[selection]
		);

		const moveToFront = useMutation(
			({ storage }) => {
				const ids = storage.get("layerIds");
				const indicies: number[] = [];

				const arr = ids.toImmutable();

				for (let i = 0; i < arr.length; i++) {
					if (selection?.includes(arr[i])) {
						indicies.push(i);
					}
				}

				for (let i = indicies.length - 1; i >= 0; i--) {
					ids.move(
						indicies[i],
						arr.length - 1 - (indicies.length - 1 - i)
					);
				}
			},
			[selection]
		);

		const setFill = useMutation(
			({ storage }, fill: Color) => {
				const liveLayers = storage.get("layers");
				setLastUsedColor(fill);

				selection?.forEach((id) => {
					liveLayers.get(id)?.set("fill", fill);
				});
			},
			[selection, setLastUsedColor]
		);

		const deleteLayers = useDeleteLayers();

		const selectionBounds = useSelectionBounds();

		if (!selectionBounds) return null;

		const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
		const y = selectionBounds.y + camera.y;

		return (
			<div
				className="absolute p-3 rounded-xl bg-white smadow-sm border-l flex select-none"
				style={{
					transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%))`,
				}}
			>
				<ColorPicker onChange={setFill} />

				<div className="flex flex-col gap-y-0.5">
					<Hint label="Bring to front" side="top">
						<Button
							variant="board"
							size="icon"
							onClick={moveToFront}
						>
							<BringToFront />
						</Button>
					</Hint>
					<Hint label="Send to back" side="bottom">
						<Button
							variant="board"
							size="icon"
							onClick={moveToBack}
						>
							<SendToBack />
						</Button>
					</Hint>
				</div>

				<div className="flex items-center pl-2 ml-2 border-l border-neutral-200">
					<Hint label="Delete">
						<Button
							variant="board"
							size="icon"
							onClick={deleteLayers}
						>
							<Trash2 />
						</Button>
					</Hint>
				</div>
			</div>
		);
	}
);

SelectionTools.displayName = "SelectionTools";
