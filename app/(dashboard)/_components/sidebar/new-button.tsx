"use client";

import { Plus } from "lucide-react";
import { CreateOrganization } from "@clerk/nextjs";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Hint } from "@/components/hint";

export const NewButton = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className="aspect-square">
					<Hint
						label="Create organization"
						side="right"
						align="start"
						sideOffset={12}
					>
						<button className="bg-white/25 h-full w-full rounded-md flex items-center justify-center opacity-60 hover:opacity-100 cursor-pointer">
							<Plus className="text-white" />
						</button>
					</Hint>
				</div>
			</DialogTrigger>

			<DialogContent className="p-0 bg-transparent border-none w-[432px]">
				{/* <DialogHeader>
					<DialogTitle></DialogTitle>
				</DialogHeader> */}
				<CreateOrganization />
			</DialogContent>
		</Dialog>
	);
};
