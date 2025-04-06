import { styles } from "@/lib/styles";

interface TextInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export default function TextInput({
  label,
  type,
  value,
  onChange,
  required = false,
}: TextInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
        style={{
          borderColor: styles.warmBorder,
          color: styles.warmText,
        }}
      />
    </div>
  );
}
