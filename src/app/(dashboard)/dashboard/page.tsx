import {
  getDashboardStats,
  getMonthlyFinanceChart,
  getProjectProgressChart,
} from "@/features/dashboard/services";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  FinanceBarChart,
  ProgressLineChart,
} from "@/components/dashboard/charts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Building2,
  TrendingUp,
  TrendingDown,
  Users,
  DoorOpen,
  Wallet,
  AlertTriangle,
  Wrench,
} from "lucide-react";

export default async function DashboardPage() {
  const [stats, financeChart, unitsChart] = await Promise.all([
    getDashboardStats(),
    getMonthlyFinanceChart(),
    getProjectProgressChart(),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="ساختمان‌ها"
          value={String(stats.totalBuildings)}
          icon={Building2}
        />
        <StatCard
          title="واحدهای فعال"
          value={String(stats.activeUnits)}
          icon={DoorOpen}
        />
        <StatCard
          title="ساکنین"
          value={String(stats.residentsCount)}
          icon={Users}
        />
        <StatCard
          title="کارهای باز"
          value={String(stats.openMaintenance)}
          icon={Wrench}
          description="نظافت، تعمیرات و ..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="دریافت ماهانه"
          value={formatCurrency(stats.monthlyIncome)}
          icon={TrendingUp}
          trend="up"
        />
        <StatCard
          title="هزینه ماهانه"
          value={formatCurrency(stats.monthlyExpenses)}
          icon={TrendingDown}
          trend="down"
        />
        <StatCard
          title="مانده صندوق"
          value={formatCurrency(stats.fundBalance)}
          icon={Wallet}
          trend={stats.fundBalance >= 0 ? "up" : "down"}
        />
        <StatCard
          title="بدهی معوق"
          value={formatCurrency(stats.outstandingDebt)}
          icon={AlertTriangle}
          description={`${stats.overdueCharges} شارژ معوق`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="واحدهای بدهکار"
          value={String(stats.unitsWithDebt)}
          icon={AlertTriangle}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>دریافت و هزینه (۶ ماه اخیر)</CardTitle>
          </CardHeader>
          <CardContent>
            <FinanceBarChart data={financeChart} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>تعداد واحد هر ساختمان</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressLineChart data={unitsChart} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>فعالیت‌های اخیر</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {stats.recentActivities.length === 0 ? (
              <li className="text-sm text-muted-foreground">
                فعالیتی ثبت نشده است
              </li>
            ) : (
              stats.recentActivities.map((activity) => (
                <li
                  key={activity.id}
                  className="flex items-center justify-between rounded-lg border p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {activity.action} — {activity.entity}
                    </p>
                    <p className="text-muted-foreground">
                      {activity.user?.name ?? "سیستم"}
                    </p>
                  </div>
                  <time className="text-xs text-muted-foreground">
                    {formatDate(activity.createdAt)}
                  </time>
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
