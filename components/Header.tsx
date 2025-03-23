"use client";

import Link from "next/link";
import { styles } from "@/lib/styles";
import { playfair } from "@/app/font/fonts";

const Header = () => {
  return (
    <header
      className="py-4 px-6 shadow-sm"
      style={{
        backgroundColor: styles.warmBg,
        borderBottom: `1px solid ${styles.warmBorder}`,
      }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/">
          <h1
            className={`text-2xl ${playfair.className}`}
            style={{ color: styles.warmPrimary }}
          >
            CollegeLX
          </h1>
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/"
                className="hover:opacity-80 transition-opacity"
                style={{ color: styles.warmText }}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/sell"
                className="font-medium hover:opacity-80 transition-opacity"
                style={{ color: styles.warmPrimary }}
              >
                Sell
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className="hover:opacity-80 transition-opacity"
                style={{ color: styles.warmText }}
              >
                Profile
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
