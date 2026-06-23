"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  incomeSchema,
  expenseSchema,
  formResolver,
  type IncomeInput,
  type ExpenseInput,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function FinanceTabs() {
  const [tab, setTab] = useState<"income" | "expense">("income");
  const router = useRouter();

  const incomeForm = useForm<IncomeInput>({
    resolver: formResolver(incomeSchema),
    defaultValues: { date: new Date().toISOString().split("T")[0] },
  });

  const expenseForm = useForm<ExpenseInput>({
    resolver: formResolver(expenseSchema),
    defaultValues: { date: new Date().toISOString().split("T")[0] },
  });

  async function submitIncome(data: IncomeInput) {
    await fetch("/api/finance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "income", ...data }),
    });
    router.refresh();
    incomeForm.reset({ date: new Date().toISOString().split("T")[0] });
  }

  async function submitExpense(data: ExpenseInput) {
    await fetch("/api/finance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "expense", ...data }),
    });
    router.refresh();
    expenseForm.reset({ date: new Date().toISOString().split("T")[0] });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2">
          <Button
            variant={tab === "income" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("income")}
          >
            ثبت درآمد
          </Button>
          <Button
            variant={tab === "expense" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("expense")}
          >
            ثبت هزینه
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {tab === "income" ? (
          <form
            onSubmit={incomeForm.handleSubmit(submitIncome)}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div className="space-y-2">
              <Label>عنوان</Label>
              <Input {...incomeForm.register("title")} />
            </div>
            <div className="space-y-2">
              <Label>مبلغ</Label>
              <Input type="number" {...incomeForm.register("amount")} />
            </div>
            <div className="space-y-2">
              <Label>تاریخ</Label>
              <Input type="date" {...incomeForm.register("date")} />
            </div>
            <div className="space-y-2">
              <Label>دسته‌بندی</Label>
              <Input {...incomeForm.register("category")} />
            </div>
            <Button type="submit" className="sm:col-span-2">
              ثبت درآمد
            </Button>
          </form>
        ) : (
          <form
            onSubmit={expenseForm.handleSubmit(submitExpense)}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div className="space-y-2">
              <Label>عنوان</Label>
              <Input {...expenseForm.register("title")} />
            </div>
            <div className="space-y-2">
              <Label>مبلغ</Label>
              <Input type="number" {...expenseForm.register("amount")} />
            </div>
            <div className="space-y-2">
              <Label>تاریخ</Label>
              <Input type="date" {...expenseForm.register("date")} />
            </div>
            <div className="space-y-2">
              <Label>دسته‌بندی</Label>
              <Input {...expenseForm.register("category")} />
            </div>
            <Button type="submit" className="sm:col-span-2">
              ثبت هزینه
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
