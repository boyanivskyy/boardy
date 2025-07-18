"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

import { api } from "@/convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const EmptyBoards = () => {
	const router = useRouter();
	const { organization } = useOrganization();
	const { mutate, pending } = useApiMutation(api.board.create);

	const onCreate = () => {
		if (!organization) return;

		mutate({
			orgId: organization.id,
			title: "Untitled",
		})
			.then((id) => {
				toast.success(`Board created`);
				router.push(`/board/${id}`);
			})
			.catch(() => {
				toast.error("Failed to create a board");
			});
	};

	return (
		<div className="h-full flex flex-col items-center justify-center">
			<Image
				src="/no-data.svg"
				alt="Empty Search"
				height={140}
				width={140}
			/>
			<h2 className="text-2xl font-semibold mt-6">
				Create your first board
			</h2>
			<p className="text-muted-foreground text-sm mt-2">
				Start by creating a board for your organization
			</p>
			<div className="mt-6">
				<Button
					className="cursor-pointer"
					disabled={pending}
					size="lg"
					onClick={onCreate}
				>
					Create board
				</Button>
			</div>
		</div>
	);
};
