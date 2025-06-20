"use client";

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import { Link2, Pencil, Trash2 } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { ConfirmModal } from "./confirm-modal";
import { Button } from "./ui/button";
import { useRenameModal } from "@/store/use-rename-modal";

interface ActionsProps {
	children: React.ReactNode;
	id: string;
	title: string;
	side?: DropdownMenuContentProps["side"];
	sideOffset?: DropdownMenuContentProps["sideOffset"];
}

export const Actions = ({
	children,
	id,
	title,
	side,
	sideOffset,
}: ActionsProps) => {
	const { mutate, pending } = useApiMutation(api.board.remove);
	const { onOpen } = useRenameModal();

	const onCopyLink = () => {
		navigator.clipboard
			.writeText(`${window.location.origin}/board/${id}`)
			.then(() => toast.success(`Link to board ${title} copied`))
			.catch(() => toast.warning("Failed to copy link"));
	};

	const onDeleteBoard = () => {
		mutate({ id })
			.then(() => toast.success(`Board ${title} successfully deleted`))
			.catch(() => toast.warning("Failed to delete the board"));
	};

	const onRenameBoard = () => {
		onOpen(id, title);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent
				side={side}
				sideOffset={sideOffset}
				className="w-60"
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<DropdownMenuItem
					className="p-3 cursor-pointer"
					onClick={onCopyLink}
				>
					<Link2 className="h4 w-4 mr-2" />
					Copy board link
				</DropdownMenuItem>
				<ConfirmModal
					header="Delete Board?"
					description="This will delete the board and all of it's content"
					disabled={pending}
					onConfirm={onDeleteBoard}
				>
					<Button
						variant="ghost"
						className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
						// onClick={onDeleteBoard}
					>
						<Trash2 className=" fill-red-500 h4 w-4 mr-2" />
						Delete
					</Button>
				</ConfirmModal>
				<DropdownMenuItem
					className="p-3 cursor-pointer"
					onClick={onRenameBoard}
				>
					<Pencil className="h4 w-4 mr-2" />
					Rename
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
