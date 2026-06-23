"use client";

import { useForm } from "react-hook-form";
import { residentSchema, formResolver, type ResidentInput } from "@/lib/validations";
import { residentTypeLabels } from "@/lib/finance/calculations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ResidentType } from "@prisma/client";

type UnitOption = {
  id: string;
  unitNumber: string;
  project: { name: string };
};

export function ResidentForm({ units }: { units: UnitOption[] }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ResidentInput>({
    resolver: formResolver(residentSchema),
    defaultValues: {
      type: ResidentType.OWNER,
      unitId: units[0]?.id ?? "",
    },
  });

  async function onSubmit(data: ResidentInput) {
    await fetch("/api/residents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    reset();
    router.refresh();
  }

  if (units.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-muted-foreground">
          ابتدا واحدی ثبت کنید.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>افزودن ساکن</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div className="space-y-2">
            <Label>واحد</Label>
            <select
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              {...register("unitId")}
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.project.name} — واحد {u.unitNumber}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>نام</Label>
            <Input {...register("name")} />
          </div>
          <div className="space-y-2">
            <Label>نوع</Label>
            <select
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              {...register("type")}
            >
              {Object.entries(residentTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>تلفن</Label>
            <Input {...register("phone")} />
          </div>
          <div className="space-y-2">
            <Label>کد ملی</Label>
            <Input {...register("nationalId")} />
          </div>
          <div className="space-y-2">
            <Label>تاریخ ورود</Label>
            <Input type="date" {...register("moveInDate")} />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={isSubmitting}>
              ثبت ساکن
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
