import { Anton ,Playfair_Display} from "next/font/google";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  weight: "600",
  subsets: ["latin"],
});


export { anton ,playfair };