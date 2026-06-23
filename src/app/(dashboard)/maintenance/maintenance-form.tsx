"use client";

import { useForm } from "react-hook-form";
import {
  maintenanceTaskSchema,
  formResolver,
  type MaintenanceTaskInput,
} from "@/lib/validations";
import {
  maintenancePriorityLabels,
  maintenanceCategoryLabels,
} from "@/lib/finance/calculations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { MaintenanceCategory, MaintenancePriority } from "@prisma/client";

type ProjectOption = { id: string; name: string };
type UnitOption = { id: string; unitNumber: string; projectId: string };

export function MaintenanceForm({
  projects,
  units,
}: {
  projects: ProjectOption[];
  units: UnitOption[];
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<MaintenanceTaskInput>({
    resolver: formResolver(maintenanceTaskSchema),
    defaultValues: {
      projectId: projects[0]?.id ?? "",
      category: MaintenanceCategory.GENERAL,
      priority: MaintenancePriority.MEDIUM,
    },
  });

  const projectId = watch("projectId");
  const filteredUnits = units.filter((u) => u.projectId === projectId);

  async function onSubmit(data: MaintenanceTaskInput) {
    await fetch("/api/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    reset();
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ثبت کار اجرایی</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>ساختمان</Label>
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                {...register("projectId")}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>واحد (اختیاری)</Label>
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                {...register("unitId")}
              >
                <option value="">— عمومی ساختمان —</option>
                {filteredUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    واحد {u.unitNumber}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>دسته‌بندی</Label>
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                {...register("category")}
              >
                {Object.entries(maintenanceCategoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>اولویت</Label>
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                {...register("priority")}
              >
                {Object.entries(maintenancePriorityLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>عنوان</Label>
            <Input {...register("title")} placeholder="مثلاً تعویض لامپ راه‌پله" />
          </div>
          <div className="space-y-2">
            <Label>توضیحات</Label>
            <Textarea {...register("description")} rows={3} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>مسئول</Label>
              <Input {...register("assignedTo")} />
            </div>
            <div className="space-y-2">
              <Label>هزینه تخمینی</Label>
              <Input type="number" {...register("estimatedCost")} />
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            ثبت درخواست
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
