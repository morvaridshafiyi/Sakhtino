import Link from "next/link";
import { getUnits } from "@/features/units/services";
import { getProjects } from "@/features/projects/services";
import { Header } from "@/components/layout/header";
import { UnitForm } from "./unit-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { unitTypeLabels } from "@/lib/finance/calculations";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "واحدها",
  path: "/units",
  noIndex: true,
});

export default async function UnitsPage() {
  const [units, projects] = await Promise.all([
    getUnits(),
    getProjects(),
  ]);

  return (
    <div className="space-y-6">
      <Header title="مدیریت واحدها" />
      <UnitForm projects={projects.map((p) => ({ id: p.id, name: p.name }))} />

      <Card>
        <CardHeader>
          <CardTitle>لیست واحدها ({units.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-right text-muted-foreground">
                  <th className="p-3">واحد</th>
                  <th className="p-3">ساختمان</th>
                  <th className="p-3">طبقه</th>
                  <th className="p-3">نوع</th>
                  <th className="p-3">شارژ پایه</th>
                  <th className="p-3">بدهی</th>
                  <th className="p-3">بستانکاری</th>
                  <th className="p-3">ساکنین</th>
                </tr>
              </thead>
              <tbody>
                {units.map((unit) => (
                  <tr key={unit.id} className="border-b">
                    <td className="p-3">
                      <Link
                        href={`/units/${unit.id}`}
                        className="font-medium hover:text-primary"
                      >
                        {unit.unitNumber}
                      </Link>
                    </td>
                    <td className="p-3">{unit.project.name}</td>
                    <td className="p-3">{unit.floor ?? "—"}</td>
                    <td className="p-3">
                      <Badge variant="secondary">
                        {unitTypeLabels[unit.type]}
                      </Badge>
                    </td>
                    <td className="p-3">{formatCurrency(Number(unit.baseCharge))}</td>
                    <td className="p-3 text-destructive">
                      {unit.debt > 0 ? formatCurrency(unit.debt) : "—"}
                    </td>
                    <td className="p-3 text-green-600">
                      {unit.credit > 0 ? formatCurrency(unit.credit) : "—"}
                    </td>
                    <td className="p-3">{unit._count.residents}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {units.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">
                هنوز واحدی ثبت نشده است.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
