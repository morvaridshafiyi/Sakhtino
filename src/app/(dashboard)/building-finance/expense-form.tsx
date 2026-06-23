"use client";

import { useForm } from "react-hook-form";
import {
  buildingExpenseSchema,
  formResolver,
  type BuildingExpenseInput,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

type ProjectOption = { id: string; name: string };

export function BuildingExpenseForm({ projects }: { projects: ProjectOption[] }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<BuildingExpenseInput>({
    resolver: formResolver(buildingExpenseSchema),
    defaultValues: {
      projectId: projects[0]?.id ?? "",
      date: new Date().toISOString().slice(0, 10),
      category: "هزینه جاری",
    },
  });

  async function onSubmit(data: BuildingExpenseInput) {
    await fetch("/api/building-finance", {
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
        <CardTitle>ثبت هزینه ساختمان</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
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
            <Label>عنوان</Label>
            <Input {...register("title")} />
          </div>
          <div className="space-y-2">
            <Label>مبلغ (ریال)</Label>
            <Input type="number" {...register("amount")} />
          </div>
          <div className="space-y-2">
            <Label>دسته‌بندی</Label>
            <Input {...register("category")} />
          </div>
          <div className="space-y-2">
            <Label>تاریخ</Label>
            <Input type="date" {...register("date")} />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={isSubmitting}>
              ثبت هزینه
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
