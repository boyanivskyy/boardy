"use client";

import { LayerType } from "@/types/canvas";
import { useStorage } from "@liveblocks/react";
import { memo } from "react";
import { Rectangle } from "./rectangle";
import { Elipse } from "./elipse";
import { Text } from "./text";
import { Note } from "./note";
import { Path } from "./path";
import { colorToCSS } from "@/lib/utils";

interface LayerPreviewProps {
	id: string;
	onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
	selectionColor?: string;
}

export const LayerPreview = memo(
	({ id, onLayerPointerDown, selectionColor }: LayerPreviewProps) => {
		const layer = useStorage((layer) => layer.layers.get(id));

		if (!layer) return null;

		switch (layer.type) {
			case LayerType.Path:
				return (
					<Path
						key={id}
						x={layer.x}
						y={layer.y}
						points={layer.points}
						onPointerDown={(e) => onLayerPointerDown(e, id)}
						stroke={selectionColor}
						fill={layer.fill ? colorToCSS(layer.fill) : "#000"}
					/>
				);
			case LayerType.Rectangle:
				return (
					<Rectangle
						id={id}
						layer={layer}
						onPointerDown={onLayerPointerDown}
						selectionColor={selectionColor}
					/>
				);
			case LayerType.Elipse:
				return (
					<Elipse
						id={id}
						layer={layer}
						onPointerDown={onLayerPointerDown}
						selectionColor={selectionColor}
					/>
				);
			case LayerType.Text:
				return (
					<Text
						id={id}
						layer={layer}
						onPointerDown={onLayerPointerDown}
						selectionColor={selectionColor}
					/>
				);
			case LayerType.Note:
				return (
					<Note
						id={id}
						layer={layer}
						onPointerDown={onLayerPointerDown}
						selectionColor={selectionColor}
					/>
				);
			default:
				console.warn("Unknown layer type");
				return null;
		}
	}
);

LayerPreview.displayName = "LayerPreview";
