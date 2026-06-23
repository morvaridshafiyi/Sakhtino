"use client";

import { useForm } from "react-hook-form";
import { materialSchema, formResolver, type MaterialInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function MaterialForm() {
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { isSubmitting } } =
    useForm<MaterialInput>({
      resolver: formResolver(materialSchema),
      defaultValues: { quantity: 0, minStock: 0, unitCost: 0, unit: "عدد" },
    });

  async function onSubmit(data: MaterialInput) {
    await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    reset({ quantity: 0, minStock: 0, unitCost: 0, unit: "عدد" });
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>افزودن مصالح</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="space-y-2">
            <Label>نام</Label>
            <Input {...register("name")} />
          </div>
          <div className="space-y-2">
            <Label>واحد</Label>
            <Input {...register("unit")} />
          </div>
          <div className="space-y-2">
            <Label>موجودی</Label>
            <Input type="number" {...register("quantity")} />
          </div>
          <div className="space-y-2">
            <Label>حداقل موجودی</Label>
            <Input type="number" {...register("minStock")} />
          </div>
          <div className="space-y-2">
            <Label>قیمت واحد</Label>
            <Input type="number" {...register("unitCost")} />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            ثبت مصالح
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
