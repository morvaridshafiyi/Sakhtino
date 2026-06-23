"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MaintenanceStatus } from "@prisma/client";

const nextStatus: Partial<Record<MaintenanceStatus, MaintenanceStatus>> = {
  PENDING: MaintenanceStatus.IN_PROGRESS,
  IN_PROGRESS: MaintenanceStatus.COMPLETED,
};

const labels: Partial<Record<MaintenanceStatus, string>> = {
  PENDING: "شروع کار",
  IN_PROGRESS: "اتمام",
};

export function MaintenanceStatusButton({
  taskId,
  status,
}: {
  taskId: string;
  status: MaintenanceStatus;
}) {
  const router = useRouter();
  const next = nextStatus[status];
  if (!next) return null;

  async function update() {
    await fetch("/api/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update",
        id: taskId,
        status: next,
        completedDate:
          next === MaintenanceStatus.COMPLETED
            ? new Date().toISOString()
            : undefined,
      }),
    });
    router.refresh();
  }

  return (
    <Button size="sm" variant="outline" onClick={update}>
      {labels[status]}
    </Button>
  );
}
