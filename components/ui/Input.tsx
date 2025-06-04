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
    />
  );
}
