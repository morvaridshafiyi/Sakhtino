import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectById } from "@/features/projects/services";
import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  maintenanceCategoryLabels,
  maintenanceStatusLabels,
} from "@/lib/finance/calculations";
import { createMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) return createMetadata({ title: "ساختمان یافت نشد" });
  return createMetadata({
    title: project.name,
    description: project.description ?? `جزئیات ساختمان ${project.name}`,
    path: `/projects/${id}`,
    noIndex: true,
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <Header title={project.name} />
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">
          مدیر: {project.manager.name}
        </span>
        <Button asChild size="sm" variant="outline">
          <Link href={`/units?projectId=${project.id}`}>مشاهده واحدها</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">واحدها</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {project._count.units}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              کارهای باز
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {project._count.maintenanceTasks}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">بودجه</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {formatCurrency(Number(project.budget))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>اطلاعات ساختمان</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>{project.description ?? "بدون توضیحات"}</p>
          {project.address && (
            <p className="text-muted-foreground">{project.address}</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>کارهای اجرایی باز</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {project.maintenanceTasks.map((task) => (
              <div key={task.id} className="rounded-lg border p-3 text-sm">
                <p className="font-medium">{task.title}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {maintenanceCategoryLabels[task.category]}
                  </Badge>
                  <Badge variant="secondary">
                    {maintenanceStatusLabels[task.status]}
                  </Badge>
                </div>
              </div>
            ))}
            {project.maintenanceTasks.length === 0 && (
              <p className="text-muted-foreground">کار بازی ثبت نشده</p>
            )}
            <Button asChild size="sm" variant="outline">
              <Link href="/maintenance">همه کارها</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>هزینه‌های اخیر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {project.expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex justify-between border-b py-2"
              >
                <span>{expense.title}</span>
                <span>{formatCurrency(Number(expense.amount))}</span>
              </div>
            ))}
            {project.expenses.length === 0 && (
              <p className="text-muted-foreground">هزینه‌ای ثبت نشده</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
