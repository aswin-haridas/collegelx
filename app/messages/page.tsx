"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { styles } from "@/shared/lib/styles";

export default function MessagesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the combined chat page
    router.push("/chat");
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2
          className="h-10 w-10 animate-spin mx-auto mb-4"
          style={{ color: styles.warmPrimary }}
        />
        <p className="text-gray-600">Redirecting to messages...</p>
      </div>
    </div>
  );
}
