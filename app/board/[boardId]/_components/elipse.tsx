import { colorToCSS } from "@/lib/utils";
import { ElipseLayer } from "@/types/canvas";

interface ElipseProps {
	id: string;
	layer: ElipseLayer;
	onPointerDown: (e: React.PointerEvent, id: string) => void;
	selectionColor?: string;
}

export const Elipse = ({
	id,
	layer,
	onPointerDown,
	selectionColor,
}: ElipseProps) => {
	const { x, y, width, height, fill } = layer;

	return (
		<ellipse
			className="drop-shadow-md"
			onPointerDown={(e) => onPointerDown(e, id)}
			style={{ transform: `translate(${x}px, ${y}px)` }}
			cx={width / 2}
			cy={height / 2}
			rx={width / 2}
			ry={height / 2}
			fill={fill ? colorToCSS(fill) : "#000"}
			stroke={selectionColor || "transparent"}
			strokeWidth={1}
		/>
	);
};
