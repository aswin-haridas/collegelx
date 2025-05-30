import { styles } from "@/shared/styles/theme";

interface InputProps {
  placeholder: string;
  type?: string;
  autoComplete?: string;
  className?: string;
  value?: string | number;
}

export default function Input({
  placeholder,
  type = "text",
  ...rest
}: InputProps) {
  return (
    <input
      {...rest}
      type={type}
      autoComplete={type}
      placeholder={placeholder}
      className={`relative block w-full px-3 py-2 border-2 rounded-md placeholder-${styles.text} focus:outline-none`}
      style={{
        borderColor: styles.primary,
        color: styles.accent,
        backgroundColor: styles.background,
      }}
    />
  );
}
