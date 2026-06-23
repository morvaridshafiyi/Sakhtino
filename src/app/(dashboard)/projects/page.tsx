import Link from "next/link";
import { getProjects } from "@/features/projects/services";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { createMetadata } from "@/lib/seo";
import { Plus, DoorOpen } from "lucide-react";

export const metadata = createMetadata({
  title: "ساختمان‌ها",
  path: "/projects",
  noIndex: true,
});

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <Header title="ساختمان‌ها" />
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="h-4 w-4" />
            ساختمان جدید
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">
                  <Link
                    href={`/projects/${project.id}`}
                    className="hover:text-primary"
                  >
                    {project.name}
                  </Link>
                </CardTitle>
                <Badge variant="secondary">فعال</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {project.address && (
                <p className="text-muted-foreground">{project.address}</p>
              )}
              <div className="flex items-center gap-2">
                <DoorOpen className="h-4 w-4 text-muted-foreground" />
                <span>{project._count.units} واحد</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <span>مدیر: {project.manager.name}</span>
                <span>بودجه: {formatCurrency(Number(project.budget))}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {projects.length === 0 && (
          <p className="col-span-full py-12 text-center text-muted-foreground">
            هنوز ساختمانی ثبت نشده است
          </p>
        )}
      </div>
    </div>
  );
}
