"use client";

import { useEffect } from "react";
import { Canvas } from "./_components/canvas";
import { Loading } from "./_components/loading";
import { Room } from "./_components/room";
import { usePathname } from "next/navigation";

// interface BoardIdPageProps {
// 	params: { boardId: string };
// }

const BoardIdPage = () => {
	const boardId = usePathname().split("/").pop()!;

	useEffect(() => {
		document.title = `Board - Miro Clone`;
	}, []);

	return (
		<Room roomId={boardId} fallback={<Loading />}>
			<Canvas boardId={boardId} />
		</Room>
	);
};

export default BoardIdPage;
