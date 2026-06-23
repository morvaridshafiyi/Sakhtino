"use client";

import { useForm } from "react-hook-form";
import { workerSchema, formResolver, type WorkerInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function WorkerForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<WorkerInput>({
    resolver: formResolver(workerSchema),
  });

  async function onSubmit(data: WorkerInput) {
    await fetch("/api/workers", {
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
        <CardTitle>افزودن کارگر</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="space-y-2">
            <Label>نام</Label>
            <Input {...register("firstName")} />
          </div>
          <div className="space-y-2">
            <Label>نام خانوادگی</Label>
            <Input {...register("lastName")} />
          </div>
          <div className="space-y-2">
            <Label>سمت</Label>
            <Input {...register("position")} />
          </div>
          <div className="space-y-2">
            <Label>تلفن</Label>
            <Input {...register("phone")} />
          </div>
          <div className="space-y-2">
            <Label>حقوق ماهانه</Label>
            <Input type="number" {...register("monthlySalary")} />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            ثبت کارگر
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
