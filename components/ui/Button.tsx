import { colors } from "./colors";
import { Loading } from "./Loading";

interface ButtonProps {
	isSubmitting: boolean;
	type: "submit" | "button" | "reset";
	text: string;
	variant?: "primary" | "secondary" | "outline";
	className?: string;
}

export default function Button({
	isSubmitting,
	text,
	type,
	variant = "primary",
	className = "",
	...rest
}: ButtonProps) {
	const getButtonClasses = () => {
		const baseClasses =
			"w-full px-4 py-2 rounded-md font-semibold border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

		switch (variant) {
			case "primary":
				return `${baseClasses} ${colors.background.primary} ${colors.text.white} hover:bg-amber-700 ${colors.focus.ring}`;
			case "secondary":
				return `${baseClasses} ${colors.primary["50"]} ${colors.text.primary} ${colors.border.primary} ${colors.hover.secondary}`;
			case "outline":
				return `${baseClasses} ${colors.background.white} ${colors.text.primary} ${colors.border.primary} ${colors.hover.primary}`;
			default:
				return `${baseClasses} ${colors.background.primary} ${colors.text.white} hover:bg-amber-700`;
		}
	};

	return (
		<button
			type={type}
			disabled={isSubmitting}
			className={`${getButtonClasses()} ${className}`}
			style={{
				cursor: isSubmitting ? "not-allowed" : "pointer",
			}}
			{...rest}
		>
			{isSubmitting ? <Loading /> : text}
		</button>
	);
}
