"use client";

import { useForm } from "react-hook-form";
import { unitSchema, formResolver, type UnitInput } from "@/lib/validations";
import { unitTypeLabels } from "@/lib/finance/calculations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { UnitType } from "@prisma/client";

type ProjectOption = { id: string; name: string };

export function UnitForm({ projects }: { projects: ProjectOption[] }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<UnitInput>({
    resolver: formResolver(unitSchema),
    defaultValues: {
      type: UnitType.RESIDENTIAL,
      baseCharge: 0,
      projectId: projects[0]?.id ?? "",
    },
  });

  async function onSubmit(data: UnitInput) {
    await fetch("/api/units", {
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
        <CardTitle>افزودن واحد</CardTitle>
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
            <Label>شماره واحد</Label>
            <Input {...register("unitNumber")} placeholder="مثلاً ۱۰۱" />
            {errors.unitNumber && (
              <p className="text-xs text-destructive">{errors.unitNumber.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>طبقه</Label>
            <Input type="number" {...register("floor")} />
          </div>
          <div className="space-y-2">
            <Label>متراژ (م²)</Label>
            <Input type="number" {...register("area")} />
          </div>
          <div className="space-y-2">
            <Label>نوع واحد</Label>
            <select
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              {...register("type")}
            >
              {Object.entries(unitTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>شارژ پایه ماهانه (ریال)</Label>
            <Input type="number" {...register("baseCharge")} />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={isSubmitting}>
              ثبت واحد
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
