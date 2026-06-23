import { Suspense } from "react";
import { getMonthlyCharges, getUnitPayments } from "@/features/charges/services";
import { getProjects } from "@/features/projects/services";
import { getUnits } from "@/features/units/services";
import { Header } from "@/components/layout/header";
import { MonthFilter } from "@/components/building/month-filter";
import { ChargesForms } from "./charges-forms";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { chargeStatusLabels } from "@/lib/finance/calculations";
import { createMetadata } from "@/lib/seo";
import { PaymentStatus } from "@prisma/client";

export const metadata = createMetadata({
  title: "شارژ و پرداخت",
  path: "/charges",
  noIndex: true,
});

type SearchParams = Promise<{ year?: string; month?: string; projectId?: string }>;

export default async function ChargesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const now = new Date();
  const year = params.year ? Number(params.year) : now.getFullYear();
  const month = params.month ? Number(params.month) : now.getMonth() + 1;
  const projectId = params.projectId || undefined;

  const [charges, payments, projects, units] = await Promise.all([
    getMonthlyCharges({ projectId, year, month }),
    getUnitPayments({ projectId, year, month }),
    getProjects(),
    getUnits({ projectId }),
  ]);

  const pendingCharges = await getMonthlyCharges({
    projectId,
    status: PaymentStatus.PARTIAL,
  }).then((partial) =>
    getMonthlyCharges({ projectId, status: PaymentStatus.PENDING }).then(
      (pending) => [...partial, ...pending],
    ),
  );

  return (
    <div className="space-y-6">
      <Header title="شارژ ماهانه و پرداخت‌ها" />
      <Suspense>
        <MonthFilter
          projects={projects.map((p) => ({ id: p.id, name: p.name }))}
        />
      </Suspense>

      <ChargesForms
        projects={projects.map((p) => ({ id: p.id, name: p.name }))}
        units={units.map((u) => ({
          id: u.id,
          unitNumber: u.unitNumber,
          projectId: u.projectId,
          project: u.project,
        }))}
        pendingCharges={pendingCharges}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>شارژهای {month}/{year}</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-right text-muted-foreground">
                  <th className="p-2">واحد</th>
                  <th className="p-2">مبلغ</th>
                  <th className="p-2">پرداخت</th>
                  <th className="p-2">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {charges.map((c) => (
                  <tr key={c.id} className="border-b">
                    <td className="p-2">{c.unit.unitNumber}</td>
                    <td className="p-2">{formatCurrency(Number(c.amount))}</td>
                    <td className="p-2">{formatCurrency(Number(c.paidAmount))}</td>
                    <td className="p-2">
                      <Badge variant="secondary">
                        {chargeStatusLabels[c.status]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>پرداخت‌های {month}/{year}</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-right text-muted-foreground">
                  <th className="p-2">واحد</th>
                  <th className="p-2">مبلغ</th>
                  <th className="p-2">روش</th>
                  <th className="p-2">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b">
                    <td className="p-2">{p.unit.unitNumber}</td>
                    <td className="p-2">{formatCurrency(Number(p.amount))}</td>
                    <td className="p-2">{p.method ?? "—"}</td>
                    <td className="p-2">{formatDate(p.paymentDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
