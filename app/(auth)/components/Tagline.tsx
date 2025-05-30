import { playfair, styles } from "@/shared/styles/theme";

export default function Tagline() {
  return (
    <div className="md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12">
      <div className="text-center md:text-left w-full max-w-lg">
        <h1
          className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${playfair.className}`}
          style={{ color: styles.primary }}
        >
          CollegeLX
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl font-light mb-8">
          A place you can share your items with ease
        </p>
        <div
          className="hidden md:block h-1 w-20 mb-8 rounded-full"
          style={{ backgroundColor: styles.background }}
        ></div>
        <p className="text-base md:text-lg">
          Connect with fellow students, share resources, and simplify campus
          life.
        </p>
      </div>
    </div>
  );
}
