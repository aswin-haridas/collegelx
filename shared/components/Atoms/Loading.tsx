import React from "react";
import { Loader2 } from "lucide-react";
import { styles } from "../../lib/styles";

const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100px",
      }}
    >
      <Loader2 color={styles.warmPrimary} className="animate-spin" size={48} />
    </div>
  );
};

export default Loading;
