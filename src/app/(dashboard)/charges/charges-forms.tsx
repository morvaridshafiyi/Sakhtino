"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  monthlyChargeSchema,
  unitPaymentSchema,
  formResolver,
  type MonthlyChargeInput,
  type UnitPaymentInput,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

type ProjectOption = { id: string; name: string };
type UnitOption = {
  id: string;
  unitNumber: string;
  projectId: string;
  project: { name: string };
};
type ChargeOption = {
  id: string;
  year: number;
  month: number;
  amount: unknown;
  paidAmount: unknown;
  unit: { unitNumber: string };
};

export function ChargesForms({
  projects,
  units,
  pendingCharges,
}: {
  projects: ProjectOption[];
  units: UnitOption[];
  pendingCharges: ChargeOption[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"charge" | "payment" | "generate">("charge");
  const now = new Date();

  const chargeForm = useForm<MonthlyChargeInput>({
    resolver: formResolver(monthlyChargeSchema),
    defaultValues: {
      projectId: projects[0]?.id ?? "",
      unitId: units[0]?.id ?? "",
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      dueDate: new Date(now.getFullYear(), now.getMonth() + 1, 10)
        .toISOString()
        .slice(0, 10),
    },
  });

  const paymentForm = useForm<UnitPaymentInput>({
    resolver: formResolver(unitPaymentSchema),
    defaultValues: {
      projectId: projects[0]?.id ?? "",
      unitId: units[0]?.id ?? "",
      method: "نقد",
    },
  });

  async function submitCharge(data: MonthlyChargeInput) {
    await fetch("/api/charges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "charge", ...data }),
    });
    chargeForm.reset();
    router.refresh();
  }

  async function submitPayment(data: UnitPaymentInput) {
    await fetch("/api/charges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "payment", ...data }),
    });
    paymentForm.reset();
    router.refresh();
  }

  async function generateCharges() {
    const projectId = projects[0]?.id;
    if (!projectId) return;
    await fetch("/api/charges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "generate",
        projectId,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        dueDate: new Date(now.getFullYear(), now.getMonth() + 1, 10)
          .toISOString()
          .slice(0, 10),
      }),
    });
    router.refresh();
  }

  const filteredUnits = units.filter(
    (u) => u.projectId === chargeForm.watch("projectId"),
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap gap-2">
          {(["charge", "payment", "generate"] as const).map((t) => (
            <Button
              key={t}
              type="button"
              variant={tab === t ? "default" : "outline"}
              size="sm"
              onClick={() => setTab(t)}
            >
              {t === "charge" ? "شارژ تکی" : t === "payment" ? "ثبت پرداخت" : "صدور گروهی"}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {tab === "generate" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              برای همه واحدهای فعال با شارژ پایه، شارژ ماه جاری صادر می‌شود.
            </p>
            <Button onClick={generateCharges} disabled={!projects.length}>
              صدور شارژ ماه {now.getMonth() + 1}
            </Button>
          </div>
        )}

        {tab === "charge" && (
          <form
            onSubmit={chargeForm.handleSubmit(submitCharge)}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div className="space-y-2">
              <Label>ساختمان</Label>
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                {...chargeForm.register("projectId")}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>واحد</Label>
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                {...chargeForm.register("unitId")}
              >
                {filteredUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    واحد {u.unitNumber}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>مبلغ (ریال)</Label>
              <Input type="number" {...chargeForm.register("amount")} />
            </div>
            <div className="space-y-2">
              <Label>سال</Label>
              <Input type="number" {...chargeForm.register("year")} />
            </div>
            <div className="space-y-2">
              <Label>ماه</Label>
              <Input type="number" min={1} max={12} {...chargeForm.register("month")} />
            </div>
            <div className="space-y-2">
              <Label>سررسید</Label>
              <Input type="date" {...chargeForm.register("dueDate")} />
            </div>
            <div className="flex items-end">
              <Button type="submit">ثبت شارژ</Button>
            </div>
          </form>
        )}

        {tab === "payment" && (
          <form
            onSubmit={paymentForm.handleSubmit(submitPayment)}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div className="space-y-2">
              <Label>واحد</Label>
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                {...paymentForm.register("unitId")}
                onChange={(e) => {
                  paymentForm.setValue("unitId", e.target.value);
                  const unit = units.find((u) => u.id === e.target.value);
                  if (unit) paymentForm.setValue("projectId", unit.projectId);
                }}
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.project.name} — واحد {u.unitNumber}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>شارژ مرتبط (اختیاری)</Label>
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                {...paymentForm.register("monthlyChargeId")}
              >
                <option value="">— بستانکاری عمومی —</option>
                {pendingCharges.map((c) => (
                  <option key={c.id} value={c.id}>
                    واحد {c.unit.unitNumber} — {c.year}/{c.month} — باقی‌مانده:{" "}
                    {Number(c.amount) - Number(c.paidAmount)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>مبلغ (ریال)</Label>
              <Input type="number" {...paymentForm.register("amount")} />
            </div>
            <div className="space-y-2">
              <Label>روش پرداخت</Label>
              <Input {...paymentForm.register("method")} />
            </div>
            <div className="space-y-2">
              <Label>شماره پیگیری</Label>
              <Input {...paymentForm.register("reference")} />
            </div>
            <div className="flex items-end">
              <Button type="submit">ثبت پرداخت</Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
