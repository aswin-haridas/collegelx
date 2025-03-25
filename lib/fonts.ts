import { Inter, Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  weight: "600",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export { playfair, inter };
