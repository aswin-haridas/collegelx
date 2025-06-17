import { colors } from "./colors";

interface InputProps {
	type: string;
	placeholder: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
	className?: string;
}

export default function Input({
	type,
	placeholder,
	value,
	onChange,
	required = false,
	className = "",
}: InputProps) {
	return (
		<input
			type={type}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			required={required}
			className={`w-full p-3 border-2 rounded-lg ${colors.border.primary} ${colors.focus.border} focus:outline-none ${className}`}
		/>
	);
}
