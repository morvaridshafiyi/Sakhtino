"use client";

import { useForm } from "react-hook-form";
import { contractorSchema, formResolver, type ContractorInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function ContractorForm() {
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { isSubmitting } } =
    useForm<ContractorInput>({ resolver: formResolver(contractorSchema) });

  async function onSubmit(data: ContractorInput) {
    await fetch("/api/contractors", {
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
        <CardTitle>افزودن پیمانکار</CardTitle>
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
            <Label>شرکت</Label>
            <Input {...register("company")} />
          </div>
          <div className="space-y-2">
            <Label>تخصص</Label>
            <Input {...register("specialty")} />
          </div>
          <div className="space-y-2">
            <Label>تلفن</Label>
            <Input {...register("phone")} />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            ثبت پیمانکار
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
