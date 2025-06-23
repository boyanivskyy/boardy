"use client";

import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NewBoardButtonProps {
	orgId: string;
	disabled?: boolean;
}

export const NewBoardButton = ({ orgId, disabled }: NewBoardButtonProps) => {
	const router = useRouter();
	const { mutate, pending } = useApiMutation(api.board.create);

	const onClick = async () => {
		try {
			const id = await mutate({
				orgId,
				title: "Untitled",
			});

			toast.success("Board created");
			router.push(`/board/${id}`);
		} catch (error) {
			toast.error(`Failed to create a board: ${error}`);
		}
	};

	return (
		<button
			disabled={disabled || pending}
			onClick={onClick}
			className={cn(
				"col-span-1 aspect-[100/127] bg-blue-300 rounded-lg hover:bg-blue-400 transition flex flex-col items-center justify-center py-6",
				(disabled || pending) && "opacity-25"
			)}
		>
			<div />
			<Plus className="h-12 w-12 text-white stroke-1" />
			<p className="text-xs text-white font-light">New Board</p>
		</button>
	);
};
