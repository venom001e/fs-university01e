"use client";

import { signOut } from "next-auth/react";

export default function Logout() {
  return (
    <div
      onClick={() => signOut()}
      className="transition-colors hover:text-gray-600 text-gray-700 cursor-pointer"
    >
      Logout
    </div>
  );
}
