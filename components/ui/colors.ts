// Centralized color system for consistent theming
export const colors = {
	// Primary brand colors
	primary: {
		50: "bg-amber-50",
		100: "bg-amber-100",
		200: "bg-amber-200",
		300: "bg-amber-300",
		400: "bg-amber-400",
		500: "bg-amber-500",
		600: "bg-amber-600",
		700: "bg-amber-700",
		800: "bg-amber-800",
		900: "bg-amber-900",
	},

	// Text colors
	text: {
		primary: "text-amber-700",
		secondary: "text-gray-600",
		muted: "text-gray-500",
		light: "text-gray-400",
		white: "text-white",
	},

	// Border colors
	border: {
		primary: "border-amber-600",
		secondary: "border-gray-200",
		focus: "border-amber-700",
	},

	// Hover states
	hover: {
		primary: "hover:bg-amber-50",
		secondary: "hover:bg-amber-100",
		text: "hover:text-amber-800",
	},

	// Background colors
	background: {
		primary: "bg-amber-600",
		secondary: "bg-amber-50",
		white: "bg-white",
		gray: "bg-gray-50",
	},

	// Focus states
	focus: {
		ring: "focus:ring-amber-500",
		border: "focus:border-amber-700",
	},
} as const;

// Utility function to combine color classes
export const getColorClasses = (
	colorType: keyof typeof colors,
	variant: string,
) => {
	return (
		colors[colorType][variant as keyof (typeof colors)[typeof colorType]] || ""
	);
};
