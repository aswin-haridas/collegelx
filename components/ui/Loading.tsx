import { LoaderCircle } from "lucide-react";

export const Loading = () => {
	return (
		<div className="flex items-center justify-center">
			<LoaderCircle className="animate-spin " />
		</div>
	);
};
