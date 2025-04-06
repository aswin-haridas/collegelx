import { styles } from "@/lib/styles";
import { Loader2 } from "lucide-react";

const Button = ({ loading }: { loading: boolean }) => {
  return (
    <button
      type="submit"
      className="w-full py-2 px-4 rounded-lg text-white flex items-center justify-center"
      style={{ backgroundColor: styles.warmPrimary }}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin h-5 w-5 mr-2" />
          Logging in...
        </>
      ) : (
        "Log In"
      )}
    </button>
  );
};

export default Button;
