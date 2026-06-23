import { getMaintenanceTasks } from "@/features/maintenance/services";
import { getProjects } from "@/features/projects/services";
import { getUnits } from "@/features/units/services";
import { Header } from "@/components/layout/header";
import { MaintenanceForm } from "./maintenance-form";
import { MaintenanceStatusButton } from "./status-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  maintenancePriorityLabels,
  maintenanceStatusLabels,
  maintenanceCategoryLabels,
} from "@/lib/finance/calculations";
import { formatCurrency } from "@/lib/utils";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "کارهای اجرایی",
  path: "/maintenance",
  noIndex: true,
});

export default async function MaintenancePage() {
  const [tasks, projects, units] = await Promise.all([
    getMaintenanceTasks(),
    getProjects(),
    getUnits(),
  ]);

  const openCount = tasks.filter(
    (t) => t.status === "PENDING" || t.status === "IN_PROGRESS",
  ).length;

  return (
    <div className="space-y-6">
      <Header title="کارهای اجرایی" />
      <MaintenanceForm
        projects={projects.map((p) => ({ id: p.id, name: p.name }))}
        units={units.map((u) => ({
          id: u.id,
          unitNumber: u.unitNumber,
          projectId: u.projectId,
        }))}
      />

      <Card>
        <CardHeader>
          <CardTitle>
            درخواست‌ها ({tasks.length}) — {openCount} باز
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {task.project.name}
                    {task.unit ? ` — واحد ${task.unit.unitNumber}` : ""}
                  </p>
                  {task.description && (
                    <p className="text-sm">{task.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="outline">
                      {maintenanceCategoryLabels[task.category]}
                    </Badge>
                    <Badge>{maintenanceStatusLabels[task.status]}</Badge>
                    <Badge variant="outline">
                      {maintenancePriorityLabels[task.priority]}
                    </Badge>
                    {task.estimatedCost && (
                      <Badge variant="secondary">
                        تخمین: {formatCurrency(Number(task.estimatedCost))}
                      </Badge>
                    )}
                  </div>
                </div>
                <MaintenanceStatusButton taskId={task.id} status={task.status} />
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">
                درخواست تعمیراتی ثبت نشده است.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
