"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="border border-neutral-700 hover:bg-neutral-800 text-neutral-300 rounded-lg px-4 py-2 transition"
    >
      Log out
    </button>
  );
}