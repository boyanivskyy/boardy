"use client";

import {
	colorToCSS,
	connectionIdToColor,
	findIntersectingLayersWithRectangle,
	penPointsToPathLayer,
	pointerEventToCanvasPoint,
	resizeBounds,
} from "@/lib/utils";
import {
	Camera,
	CanvasMode,
	CanvasState,
	Color,
	LayerType,
	Point,
	Side,
	XYWH,
} from "@/types/canvas";
import {
	useCanRedo,
	useCanUndo,
	useHistory,
	useMutation,
	useOthersMapped,
	useSelf,
	useStorage,
} from "@liveblocks/react";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { nanoid } from "nanoid";

import { useDeleteLayers } from "@/hooks/use-delete-layers";
import { useDisableScrollBounce } from "@/hooks/use-disable-scroll-bounce";
import { LiveObject } from "@liveblocks/client";
import { CursorsPresence } from "./cursors-presence";
import { Info } from "./info";
import { LayerPreview } from "./layer-preview";
import { Participants } from "./participants";
import { Path } from "./path";
import { SelectionBox } from "./selection-box";
import { SelectionTools } from "./selection-tools";
import { Toolbar } from "./toolbar";

const SELECTION_NET_TRASHHOLD = 5;
const MAX_LAYERS = 100;

interface CanvasProps {
	boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
	const layerIds = useStorage((root) => root.layerIds);
	const pencilDraft = useSelf((me) => me.presence.pencilDraft);

	const [lastUsedColor, setLastUsedColor] = useState<Color>({
		r: 255,
		g: 255,
		b: 255,
	});

	const [canvasState, setCanvasState] = useState<CanvasState>({
		mode: CanvasMode.None,
	});

	const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });

	useDisableScrollBounce();
	const history = useHistory();
	const canUndo = useCanUndo();
	const canRedo = useCanRedo();

	const insertLayer = useMutation(
		(
			{ storage, setMyPresence },
			layerType:
				| LayerType.Elipse
				| LayerType.Rectangle
				| LayerType.Text
				| LayerType.Note,
			position: Point
		) => {
			const liveLayers = storage.get("layers");
			if (liveLayers.size >= MAX_LAYERS) return;

			const liveLayerIds = storage.get("layerIds");
			const layerId = nanoid();
			const layer = new LiveObject({
				type: layerType,
				x: position.x,
				y: position.y,
				height: 100,
				width: 100,
				fill: lastUsedColor,
			});

			liveLayerIds.push(layerId);
			liveLayers.set(layerId, layer);

			setMyPresence({ selection: [layerId] }, { addToHistory: true });
			setCanvasState({ mode: CanvasMode.None });
		},
		[lastUsedColor]
	);

	const translateSelectedLayers = useMutation(
		({ storage, self }, point: Point) => {
			if (canvasState.mode !== CanvasMode.Translating) {
				return;
			}

			const offset = {
				x: point.x - canvasState.current.x,
				y: point.y - canvasState.current.y,
			};

			const liveLayers = storage.get("layers");

			for (const id of self.presence.selection) {
				const layer = liveLayers.get(id);

				if (layer) {
					layer.update({
						x: layer.get("x") + offset.x,
						y: layer.get("y") + offset.y,
					});
				}
			}

			setCanvasState({ mode: CanvasMode.Translating, current: point });
		},
		[canvasState]
	);

	const updateSelectionNet = useMutation(
		({ storage, setMyPresence }, current: Point, origin: Point) => {
			const layers = storage.get("layers").toImmutable();

			setCanvasState({
				mode: CanvasMode.SelectionNet,
				current,
				origin,
			});

			const ids = findIntersectingLayersWithRectangle(
				layerIds!,
				layers,
				origin,
				current
			);

			setMyPresence({ selection: ids }, { addToHistory: true });
		},
		[layerIds]
	);

	const startMultiSelection = useCallback((current: Point, origin: Point) => {
		if (
			Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) >
			SELECTION_NET_TRASHHOLD
		) {
			setCanvasState({
				mode: CanvasMode.SelectionNet,
				current,
				origin,
			});
		}
	}, []);

	const continueDrawing = useMutation(
		({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
			const { pencilDraft } = self.presence;
			if (
				canvasState.mode !== CanvasMode.Pencil ||
				e.buttons !== 1 ||
				pencilDraft === null
			) {
				return;
			}

			setMyPresence({
				cursor: point,
				pencilDraft:
					pencilDraft.length === 1 &&
					pencilDraft[0][0] === point.x &&
					pencilDraft[0][1] === point.y
						? pencilDraft
						: [...pencilDraft, [point.x, point.y, e.pressure]],
			});
		},
		[canvasState.mode]
	);

	const insertPath = useMutation(
		({ storage, self, setMyPresence }) => {
			const liveLayers = storage.get("layers");
			const { pencilDraft } = self.presence;

			if (
				pencilDraft == null ||
				pencilDraft.length < 2 ||
				liveLayers.size >= MAX_LAYERS
			) {
				setMyPresence({ pencilDraft: null });
				return;
			}

			const id = nanoid();
			liveLayers.set(
				id,
				new LiveObject(penPointsToPathLayer(pencilDraft, lastUsedColor))
			);

			const liveLayerIds = storage.get("layerIds");
			liveLayerIds.push(id);

			setMyPresence({ pencilDraft: null });
			setCanvasState({ mode: CanvasMode.Pencil });
		},
		[lastUsedColor, setCanvasState]
	);

	const startDrawing = useMutation(
		({ setMyPresence }, point: Point, pressure: number) => {
			setMyPresence({
				pencilDraft: [[point.x, point.y, pressure]],
				penColor: lastUsedColor,
			});
		},
		[lastUsedColor]
	);

	const resizeSelectedLayer = useMutation(
		({ storage, self }, point: Point) => {
			if (canvasState.mode !== CanvasMode.Resizing) {
				return;
			}

			const bounds = resizeBounds(
				canvasState.initialBounds,
				canvasState.corner,
				point
			);

			const liveLayers = storage.get("layers");
			const layer = liveLayers.get(self.presence.selection[0]);
			if (layer) {
				layer.update(bounds);
			}
		},
		[canvasState]
	);

	const unselectLayers = useMutation(({ self, setMyPresence }) => {
		if (self.presence.selection.length > 0) {
			setMyPresence({ selection: [] }, { addToHistory: true });
		}
	}, []);

	const onResizeHandlePointerDown = useCallback(
		(corner: Side, initialBounds: XYWH) => {
			history.pause();

			console.log({ corner, initialBounds });

			setCanvasState({
				mode: CanvasMode.Resizing,
				initialBounds,
				corner,
			});
		},
		[history]
	);

	const onWheel = useCallback((e: React.WheelEvent) => {
		setCamera((camera) => ({
			x: camera.x - e.deltaX,
			y: camera.y - e.deltaY,
		}));
	}, []);

	const onPointerMove = useMutation(
		({ setMyPresence }, e: React.PointerEvent) => {
			e.preventDefault();
			const current = pointerEventToCanvasPoint(e, camera);

			if (canvasState.mode === CanvasMode.Pressing) {
				startMultiSelection(current, canvasState.origin);
			} else if (canvasState.mode === CanvasMode.SelectionNet) {
				updateSelectionNet(current, canvasState.origin);
			} else if (canvasState.mode === CanvasMode.Translating) {
				translateSelectedLayers(current);
			} else if (canvasState.mode === CanvasMode.Resizing) {
				resizeSelectedLayer(current);
			} else if (canvasState.mode === CanvasMode.Pencil) {
				continueDrawing(current, e);
			}

			setMyPresence({ cursor: current });
		},
		[
			canvasState,
			camera,
			startMultiSelection,
			updateSelectionNet,
			translateSelectedLayers,
			resizeSelectedLayer,
			continueDrawing,
		]
	);

	const onPointerLeave = useMutation(({ setMyPresence }) => {
		setMyPresence({ cursor: null });
	}, []);

	const onPointerDown = useCallback(
		(e: React.PointerEvent) => {
			const point = pointerEventToCanvasPoint(e, camera);

			if (canvasState.mode === CanvasMode.Inserting) {
				return;
			}

			// TODO: add case for drawing
			if (canvasState.mode === CanvasMode.Pencil) {
				startDrawing(point, e.pressure);
				return;
			}

			setCanvasState({ mode: CanvasMode.Pressing, origin: point });
		},
		[camera, canvasState.mode, setCanvasState, startDrawing]
	);

	const onPointerUp = useMutation(
		({}, e: React.PointerEvent) => {
			const point = pointerEventToCanvasPoint(e, camera);

			if (
				canvasState.mode === CanvasMode.None ||
				canvasState.mode === CanvasMode.Pressing
			) {
				unselectLayers();

				setCanvasState({ mode: CanvasMode.None });
			} else if (canvasState.mode === CanvasMode.Pencil) {
				insertPath();
			} else if (canvasState.mode === CanvasMode.Inserting) {
				insertLayer(canvasState.layerType, point);
			} else {
				setCanvasState({
					mode: CanvasMode.None,
				});
			}

			history.resume();
		},
		[
			camera,
			canvasState,
			history,
			insertLayer,
			setCanvasState,
			unselectLayers,
			insertPath,
		]
	);

	const onLayerPointerDown = useMutation(
		({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
			if (
				canvasState.mode === CanvasMode.Pencil ||
				canvasState.mode === CanvasMode.Inserting
			) {
				return;
			}

			history.pause();
			e.stopPropagation();

			const point = pointerEventToCanvasPoint(e, camera);

			if (!self.presence.selection.includes(layerId)) {
				setMyPresence({ selection: [layerId] }, { addToHistory: true });
			}

			setCanvasState({ mode: CanvasMode.Translating, current: point });
		},
		[setCanvasState, camera, history, canvasState.mode]
	);

	const selections = useOthersMapped((other) => other.presence.selection);

	const layerIdsToColorSelection = useMemo(() => {
		const layerIdsToColorSelection: Record<string, string> = {};

		for (const user of selections) {
			const [connectionId, selection] = user;

			for (const layerId of selection) {
				layerIdsToColorSelection[layerId] =
					connectionIdToColor(connectionId);
			}
		}

		return layerIdsToColorSelection;
	}, [selections]);

	const deleteLayers = useDeleteLayers();

	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			switch (e.key) {
				// FIXME: remove a text element when trying to backspace on text
				// case "Backspace":
				// 	if (canvasState.mode !== CanvasMode.Inserting) {
				// 		deleteLayers();
				// 	}
				// 	break;
				case "z":
					if (e.ctrlKey || e.metaKey) {
						if (e.shiftKey) {
							history.redo();
						} else {
							history.undo();
						}
						break;
					}
			}
		}

		document.addEventListener("keydown", onKeyDown);

		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [deleteLayers, history]);

	return (
		<main className="h-full w-full relative bg-neutral-100 touch-none">
			<Info boardId={boardId} />
			<Participants />
			<Toolbar
				canvasState={canvasState}
				canUndo={canUndo}
				canRedo={canRedo}
				setCanvasState={setCanvasState}
				undo={history.undo}
				redo={history.redo}
			/>
			<SelectionTools
				camera={camera}
				setLastUsedColor={setLastUsedColor}
			/>
			<svg
				className="h-[100vh] w-[100vw]"
				onWheel={onWheel}
				onPointerMove={onPointerMove}
				onPointerLeave={onPointerLeave}
				onPointerUp={onPointerUp}
				onPointerDown={onPointerDown}
			>
				<g
					style={{
						transform: `translateX(${camera.x}px) translateY(${camera.y}px)`,
					}}
				>
					{layerIds?.map((layerId) => (
						<LayerPreview
							key={layerId}
							id={layerId}
							onLayerPointerDown={onLayerPointerDown}
							selectionColor={layerIdsToColorSelection[layerId]}
						/>
					))}
					<SelectionBox
						onResizeHandlePointerDown={onResizeHandlePointerDown}
					/>
					{canvasState.mode === CanvasMode.SelectionNet &&
						canvasState.current != null && (
							<rect
								className="fill-blue-500/5 stroke-blue-500 stroke-1"
								x={Math.min(
									canvasState.origin.x,
									canvasState.current.x
								)}
								y={Math.min(
									canvasState.origin.y,
									canvasState.current.y
								)}
								width={Math.abs(
									canvasState.origin.x - canvasState.current.x
								)}
								height={Math.abs(
									canvasState.origin.y - canvasState.current.y
								)}
							/>
						)}
					<CursorsPresence />
					{pencilDraft != null && pencilDraft.length > 0 && (
						<Path
							points={pencilDraft}
							fill={colorToCSS(lastUsedColor)}
							x={0}
							y={0}
						/>
					)}
				</g>
			</svg>
		</main>
	);
};
