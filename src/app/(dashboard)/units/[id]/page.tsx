import { notFound } from "next/navigation";
import { getUnitById } from "@/features/units/services";
import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  chargeStatusLabels,
  unitTypeLabels,
  residentTypeLabels,
} from "@/lib/finance/calculations";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const unit = await getUnitById(id);
  return createMetadata({
    title: unit ? `واحد ${unit.unitNumber}` : "واحد",
    path: `/units/${id}`,
    noIndex: true,
  });
}

export default async function UnitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const unit = await getUnitById(id);
  if (!unit) notFound();

  return (
    <div className="space-y-6">
      <Header title={`واحد ${unit.unitNumber} — ${unit.project.name}`} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">بدهی</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold text-destructive">
            {formatCurrency(unit.debt)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">بستانکاری</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold text-green-600">
            {formatCurrency(unit.credit)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">کل شارژ</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold">
            {formatCurrency(unit.totalCharges)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">کل پرداخت</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold">
            {formatCurrency(unit.totalPayments)}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات واحد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>نوع: {unitTypeLabels[unit.type]}</p>
            <p>طبقه: {unit.floor ?? "—"}</p>
            <p>متراژ: {unit.area ? `${unit.area} م²` : "—"}</p>
            <p>شارژ پایه: {formatCurrency(Number(unit.baseCharge))}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ساکنین</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {unit.residents.map((r) => (
                <li key={r.id} className="flex justify-between rounded border p-2">
                  <span>
                    {r.name}{" "}
                    <Badge variant="outline">{residentTypeLabels[r.type]}</Badge>
                  </span>
                  <span className="text-muted-foreground">{r.phone ?? "—"}</span>
                </li>
              ))}
              {unit.residents.length === 0 && (
                <p className="text-muted-foreground">ساکنی ثبت نشده</p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>شارژهای اخیر</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-right text-muted-foreground">
                <th className="p-2">دوره</th>
                <th className="p-2">مبلغ</th>
                <th className="p-2">پرداخت‌شده</th>
                <th className="p-2">وضعیت</th>
                <th className="p-2">سررسید</th>
              </tr>
            </thead>
            <tbody>
              {unit.monthlyCharges.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="p-2">
                    {c.year}/{c.month}
                  </td>
                  <td className="p-2">{formatCurrency(Number(c.amount))}</td>
                  <td className="p-2">{formatCurrency(Number(c.paidAmount))}</td>
                  <td className="p-2">
                    <Badge variant="secondary">
                      {chargeStatusLabels[c.status]}
                    </Badge>
                  </td>
                  <td className="p-2">{formatDate(c.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
