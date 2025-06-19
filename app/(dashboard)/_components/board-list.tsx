"use client";

import { use } from "react";
import { EmptySearch } from "./empty-search";
import { EmptyFavorites } from "./empty-favorites";
import { EmptyBoards } from "./empty-boards";

interface BoardListProps {
	orgId: string;
	query: Promise<{
		search?: string;
		favorites?: string;
	}>;
}

export const BoardList = ({ orgId, query }: BoardListProps) => {
	const { search, favorites } = use(query);
	const data = []; // TODO: change to API call

	if (!data?.length && search) {
		return <EmptySearch />;
	}

	if (!data?.length && favorites) {
		return <EmptyFavorites />;
	}

	if (!data?.length) {
		return <EmptyBoards />;
	}

	return <p>should be data for {orgId}</p>;
};
