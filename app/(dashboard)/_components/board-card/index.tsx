"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Overlay } from "./overlay";
import { useAuth } from "@clerk/nextjs";
import { Footer } from "./footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Actions } from "@/components/actions";
import { MoreHorizontal } from "lucide-react";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface BoardCardProps {
	id: string;
	title: string;
	imageUrl: string;
	authorId: string;
	authorName: string;
	createdAt: number;
	orgId: string;
	isFavorite: boolean;
}

export const BoardCard = ({
	id,
	title,
	imageUrl,
	authorId,
	authorName,
	createdAt,
	orgId,
	isFavorite,
}: BoardCardProps) => {
	const { userId } = useAuth();

	const authorLabel = userId === authorId ? "You" : authorName;
	const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true });

	const { mutate: favoriteHandler, pending: pendingFavoriting } =
		useApiMutation(api.board.favorite);

	const { mutate: unfavoriteHandler, pending: pendingUnfavoriting } =
		useApiMutation(api.board.unfavorite);

	const toggleFavorite = () => {
		if (isFavorite) {
			unfavoriteHandler({ id }).catch(() =>
				toast.warning("Failed to favorite the board")
			);
		} else {
			favoriteHandler({ id, orgId }).catch(() =>
				toast.warning("Failed to unfavorite the board")
			);
		}
	};

	return (
		<Link href={`/board/${id}`}>
			<div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
				<div className="relative flex-1 bg-amber-50">
					<Image
						src={imageUrl}
						alt={title}
						fill
						className="object-fit"
					/>
					<Overlay />
					<Actions id={id} title={title} side="right">
						<button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none cursor-pointer">
							<MoreHorizontal className="text-white opacity-75 hover:opacity-100 transition-opacity" />
						</button>
					</Actions>
				</div>
				<Footer
					isFavorite={isFavorite}
					title={title}
					authorLabel={authorLabel}
					createdAtLabel={createdAtLabel}
					onClick={toggleFavorite}
					disabled={pendingFavoriting || pendingUnfavoriting}
				/>
			</div>
		</Link>
	);
};

export function BoardCardSkeleton() {
	return (
		<div className="aspect-[100/127] rounded-lg overflow-hidden">
			<Skeleton className="h-full w-full" />
		</div>
	);
}
