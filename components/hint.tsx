import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

interface HintProps {
	label: string;
	children: React.ReactNode;
	side?: "top" | "bottom" | "left" | "right";
	align?: "start" | "center" | "end";
	sideOffset?: number;
	alignOffset?: number;
}

export const Hint = (props: HintProps) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={100}>
				<TooltipTrigger asChild>{props.children}</TooltipTrigger>
				<TooltipContent
					className="text-white bg-black border-black"
					side={props.side}
					align={props.align}
					sideOffset={props.sideOffset}
					alignOffset={props.alignOffset}
				>
					<p className="font-semibold capitalize">{props.label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
