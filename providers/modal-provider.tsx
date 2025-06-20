"use client";

import { useEffect, useState } from "react";

import { RenameModal } from "@/components/modals/rename-modal";

export const ModalProvider = () => {
	const [isMounted, setIsMounted] = useState(false);

	// NOTE: useEffect is called when we need it so no hydration error that smth is missing(WHY & HOW????)
	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<>
			{/* NOTE: all other programatically controlled modals can be added here to avoid hydration errors */}
			<RenameModal />
		</>
	);
};
