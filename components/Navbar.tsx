'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow p-4">
      <div className="max-w-4xl mx-auto flex justify-between">
        <Link href="/" className="text-xl font-bold">AISAT Market</Link>
        <div className="space-x-4">
          <Link href="/buy" className="hover:text-blue-500">Buy</Link>
          <Link href="/sell" className="hover:text-blue-500">Sell</Link>
          <Link href="/messages" className="hover:text-blue-500">Messages</Link>
          <Link href="/admin" className="hover:text-blue-500">Admin</Link>
        </div>
      </div>
    </nav>
  );
}