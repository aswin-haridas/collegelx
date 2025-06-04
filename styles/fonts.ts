import { Inter, Playfair_Display_SC } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display_SC({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-playfair",
});

export { inter, playfair };
