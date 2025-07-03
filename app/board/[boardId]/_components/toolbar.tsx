import { Skeleton } from "@/components/ui/skeleton";

export const Toolbar = () => {
	return (
		<div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
			<div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
				<div>Pencil</div>
				<div>Square</div>
				<div>Circle</div>
				<div>Arrow</div>
			</div>
			<div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
				<div>Undo</div>
				<div>Redo</div>
			</div>
		</div>
	);
};

Toolbar.Skeleton = function ToolbarSkeleton() {
	return (
		<div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col p-3 gap-y-4 bg-white min-h-[360px] min-w-[52px] rounded-md shadow-md">
			<Skeleton className="h-[348px] w-full bg-muted" />
		</div>
	);
};
