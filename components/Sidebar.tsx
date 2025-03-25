"use client";

import Link from "next/link";
import { styles } from "@/lib/styles";
import { playfair } from "@/lib/fonts";

const Sidebar = () => {
  return (
    <aside
      className="h-screen w-64 fixed left-0 top-0 shadow-md flex flex-col py-8 px-4"
      style={{
        backgroundColor: styles.warmBg,
        borderRight: `1px solid ${styles.warmBorder}`,
      }}
    >
      <Link href="/" className="mb-10 px-2">
        <h1
          className={`text-2xl ${playfair.className}`}
          style={{ color: styles.warmPrimary }}
        >
          CollegeLX
        </h1>
      </Link>

      <nav className="flex-1">
        <ul className="flex flex-col space-y-4">
          <li>
            <Link
              href="/"
              className="block py-2 px-2 rounded transition-colors "
              style={{
                color: styles.warmText,
                backgroundColor: "transparent",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = `${styles.warmPrimary}`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/sell"
              className="block py-2 px-2 rounded transition-colors "
              style={{
                color: styles.warmText,
                backgroundColor: "transparent",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = `${styles.warmPrimary}`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Sell
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="block py-2 px-2 rounded transition-colors "
              style={{
                color: styles.warmText,
                backgroundColor: "transparent",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = `${styles.warmPrimary}`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Profile
            </Link>
          </li>
        </ul>
      </nav>

      <div
        className="mt-auto px-2 py-4 text-sm"
        style={{ color: styles.warmText }}
      >
        <p>© 2023 CollegeLX</p>
      </div>
    </aside>
  );
};

export default Sidebar;
