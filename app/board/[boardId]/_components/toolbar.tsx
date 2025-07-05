"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ToolButton } from "./tool-button";
import {
	Circle,
	MousePointer2,
	Pencil,
	Redo2,
	Square,
	StickyNote,
	Type,
	Undo,
} from "lucide-react";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";

interface ToolbarProps {
	canvasState: CanvasState;
	setCanvasState: (newState: CanvasState) => void;
	undo: () => void;
	redo: () => void;
	canUndo: boolean;
	canRedo: boolean;
}

export const Toolbar = ({
	canvasState,
	setCanvasState,
	undo,
	redo,
	canUndo,
	canRedo,
}: ToolbarProps) => {
	const isSelectActive = [
		CanvasMode.None,
		CanvasMode.Translating,
		CanvasMode.SelectionNet,
		CanvasMode.Pressing,
		CanvasMode.Resizing,
	].includes(canvasState.mode);

	return (
		<div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
			<div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
				<ToolButton
					label="Select"
					icon={MousePointer2}
					onClick={() => setCanvasState({ mode: CanvasMode.None })}
					isActive={isSelectActive}
				/>
				<ToolButton
					label="Text"
					icon={Type}
					onClick={() =>
						setCanvasState({
							mode: CanvasMode.Inserting,
							layerType: LayerType.Text,
						})
					}
					isActive={
						canvasState.mode === CanvasMode.Inserting &&
						canvasState.layerType === LayerType.Text
					}
				/>
				<ToolButton
					label="Sticky Note"
					icon={StickyNote}
					onClick={() =>
						setCanvasState({
							mode: CanvasMode.Inserting,
							layerType: LayerType.Note,
						})
					}
					isActive={
						canvasState.mode === CanvasMode.Inserting &&
						canvasState.layerType === LayerType.Note
					}
				/>
				<ToolButton
					label="Rectangle"
					icon={Square}
					onClick={() =>
						setCanvasState({
							mode: CanvasMode.Inserting,
							layerType: LayerType.Rectangle,
						})
					}
					isActive={
						canvasState.mode === CanvasMode.Inserting &&
						canvasState.layerType === LayerType.Rectangle
					}
				/>
				<ToolButton
					label="Ellipse"
					icon={Circle}
					onClick={() =>
						setCanvasState({
							mode: CanvasMode.Inserting,
							layerType: LayerType.Elipse,
						})
					}
					isActive={
						canvasState.mode === CanvasMode.Inserting &&
						canvasState.layerType === LayerType.Elipse
					}
				/>
				<ToolButton
					label="Pen"
					icon={Pencil}
					onClick={() =>
						setCanvasState({
							mode: CanvasMode.Pencil,
						})
					}
					isActive={canvasState.mode === CanvasMode.Pencil}
				/>
			</div>
			<div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
				<ToolButton
					label="Undo"
					icon={Undo}
					onClick={undo}
					isDisabled={!canUndo}
				/>
				<ToolButton
					label="Redo"
					icon={Redo2}
					onClick={redo}
					isDisabled={!canRedo}
				/>
			</div>
		</div>
	);
};

export function ToolbarSkeleton() {
	return (
		<div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col p-3 gap-y-4 bg-white min-h-[360px] min-w-[52px] rounded-md shadow-md">
			<Skeleton className="h-[348px] w-full bg-muted" />
		</div>
	);
}
