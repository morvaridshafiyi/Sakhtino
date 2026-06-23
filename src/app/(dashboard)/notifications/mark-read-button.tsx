"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();

  async function markRead() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={markRead}>
      خوانده شد
    </Button>
  );
}
