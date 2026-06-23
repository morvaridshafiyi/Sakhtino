"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { projectSchema, formResolver, type ProjectInput } from "@/lib/validations";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export default function NewProjectPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<ProjectInput>({
    resolver: formResolver(projectSchema),
    defaultValues: {
      status: "IN_PROGRESS",
      progress: 100,
      budget: 0,
      managerId: "",
    },
  });

  useEffect(() => {
    if (session?.user?.id) {
      form.setValue("managerId", session.user.id);
    }
  }, [session, form]);

  async function onSubmit(data: ProjectInput) {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const project = await res.json();
      router.push(`/projects/${project.id}`);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Header title="ساختمان جدید" />
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات ساختمان</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">نام ساختمان</Label>
              <Input id="name" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">آدرس</Label>
              <Input id="address" {...form.register("address")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">توضیحات</Label>
              <Textarea id="description" {...form.register("description")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">بودجه عملیاتی سالانه (ریال)</Label>
              <Input id="budget" type="number" {...form.register("budget")} />
            </div>
            <input type="hidden" {...form.register("managerId")} />
            <input type="hidden" {...form.register("status")} value="IN_PROGRESS" />
            <input type="hidden" {...form.register("progress")} value={100} />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "در حال ذخیره..." : "ثبت ساختمان"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
