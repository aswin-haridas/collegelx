import { Playfair_Display } from "next/font/google";

const styles = {
  text: "#2E2A36", // Slightly deeper for better contrast
  background: "#FAF9F6", // Cleaner, brighter neutral
  primary: "#A24A2F", // Richer, more vibrant earthy red
  primary_dark: "#6E2410", // Deeper contrast shade
  primary_light: "#F0E7D1", // Softer, lighter variant
  secondary: "#7AAE90", // Slightly cooler green for balance
  accent: "#1F1F2E", // Stronger dark navy for emphasis
};
const playfair = Playfair_Display({
  weight: "600",
  subsets: ["latin"],
});

export { playfair, styles };
