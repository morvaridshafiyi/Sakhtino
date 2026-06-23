import { getResidents } from "@/features/residents/services";
import { getUnits } from "@/features/units/services";
import { Header } from "@/components/layout/header";
import { ResidentForm } from "./resident-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { residentTypeLabels } from "@/lib/finance/calculations";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "ساکنین",
  path: "/residents",
  noIndex: true,
});

export default async function ResidentsPage() {
  const [residents, units] = await Promise.all([getResidents(), getUnits()]);

  const unitOptions = units.map((u) => ({
    id: u.id,
    unitNumber: u.unitNumber,
    project: u.project,
  }));

  return (
    <div className="space-y-6">
      <Header title="مدیریت ساکنین" />
      <ResidentForm units={unitOptions} />

      <Card>
        <CardHeader>
          <CardTitle>لیست ساکنین ({residents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-right text-muted-foreground">
                  <th className="p-3">نام</th>
                  <th className="p-3">واحد</th>
                  <th className="p-3">ساختمان</th>
                  <th className="p-3">نوع</th>
                  <th className="p-3">تلفن</th>
                  <th className="p-3">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {residents.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="p-3 font-medium">{r.name}</td>
                    <td className="p-3">{r.unit.unitNumber}</td>
                    <td className="p-3">{r.unit.project.name}</td>
                    <td className="p-3">
                      <Badge variant="outline">{residentTypeLabels[r.type]}</Badge>
                    </td>
                    <td className="p-3">{r.phone ?? "—"}</td>
                    <td className="p-3">
                      <Badge variant={r.isActive ? "default" : "secondary"}>
                        {r.isActive ? "فعال" : "غیرفعال"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
