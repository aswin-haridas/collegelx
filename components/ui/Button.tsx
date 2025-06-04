import { Loading } from "./Loading";

interface ButtonProps {
  isSubmitting: boolean;
  type: "submit" | "button" | "reset";
  text: string;
}

export default function Button({
  isSubmitting,
  text,
  type,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={isSubmitting}
      className="w-full px-4 py-2 rounded-md font-semibold border transition-all duration-200 text-[#FAF9F6] hover:opacity-90  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FAF9F6]"
      style={{
        cursor: isSubmitting ? "not-allowed" : "pointer",
      }}
      {...rest}
    >
      {isSubmitting ? <Loading /> : text}
    </button>
  );
}
