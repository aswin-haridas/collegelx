import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useLoginCheck = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // router.push("/auth/login");
    }
  }, [router]);
};
