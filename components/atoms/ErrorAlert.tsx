interface ErrorAlertProps {
  message: string | null;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <div
      className="p-3 rounded-lg text-sm"
      style={{
        backgroundColor: "rgba(220, 38, 38, 0.1)",
        color: "#DC2626",
      }}
    >
      {message}
    </div>
  );
}
