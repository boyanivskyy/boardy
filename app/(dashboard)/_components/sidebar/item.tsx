"use client";

import { useOrganization, useOrganizationList } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Hint } from "@/components/hint";

interface ItemProps {
	id: string;
	name: string;
	imageUrl: string;
}

export const Item = ({ id, name, imageUrl }: ItemProps) => {
	const { organization } = useOrganization();
	const { setActive } = useOrganizationList();

	const isActive = organization?.id === id;

	const onOrgImageClick = () => {
		if (!setActive) return;

		setActive({ organization: id });
	};

	return (
		<div className="aspect-square relative">
			<Hint label={name} side="right" align="end" sideOffset={12}>
				<Image
					fill
					className={cn(
						"rounded-md cursor-pointer opacity-75 hover:opacity-100 transition",
						isActive && "opacity-100"
					)}
					src={imageUrl}
					alt={name}
					onClick={onOrgImageClick}
				/>
			</Hint>
		</div>
	);
};
