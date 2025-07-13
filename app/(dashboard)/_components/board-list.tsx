"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { EmptySearch } from "./empty-search";
import { EmptyFavorites } from "./empty-favorites";
import { EmptyBoards } from "./empty-boards";
import { BoardCard, BoardCardSkeleton } from "./board-card";
import { NewBoardButton } from "./new-board-button";
import { useSearchParams } from "next/navigation";
import React from "react";

interface BoardListProps {
	orgId: string;
}

export const BoardList = ({ orgId }: BoardListProps) => {
	const params = useSearchParams();
	const favorites = params.get("favorites") || "";
	const search = params.get("search") || "";

	const data = useQuery(api.boards.get, { orgId, favorites, search });

	if (data === undefined) {
		return (
			<div>
				<h2 className="text-3xl">Team Boards</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 bp-10">
					<NewBoardButton orgId={orgId} disabled={true} />
					{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((key) => (
						<BoardCardSkeleton key={key} />
					))}
				</div>
			</div>
		);
	}

	if (!data?.length && search) {
		return <EmptySearch />;
	}

	if (!data?.length && favorites) {
		return <EmptyFavorites />;
	}

	if (!data?.length) {
		return <EmptyBoards />;
	}

	return (
		<div>
			<h2 className="text-3xl">
				{favorites ? "Favorite Boards" : "Team Boards"}
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 bp-10">
				<NewBoardButton orgId={orgId} disabled={false} />
				{data.map((board) => (
					<BoardCard
						key={board._id}
						id={board._id}
						title={board.title}
						imageUrl={board.imageUrl}
						authorId={board.authorId}
						authorName={board.authorName}
						createdAt={board._creationTime}
						orgId={board.orgId}
						isFavorite={board.isFavorite}
					/>
				))}
			</div>
		</div>
	);
};
