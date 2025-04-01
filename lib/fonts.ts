import { Inter, Playfair_Display, Montserrat } from "next/font/google";

const playfair = Playfair_Display({
  weight: "600",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export { playfair, inter, montserrat };
