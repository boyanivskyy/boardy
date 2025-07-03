import { Canvas } from "./_components/canvas";
import { Loading } from "./_components/loading";
import { Room } from "./_components/room";

interface BoardIdPageProps {
	params: { boardId: string };
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
	const boardId = (await params).boardId;

	return (
		<Room roomId={boardId} fallback={<Loading />}>
			<Canvas boardId={boardId} />
		</Room>
	);
};

export default BoardIdPage;
