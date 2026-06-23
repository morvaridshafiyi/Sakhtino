import { Suspense } from "react";
import {
  getBuildingFinancialSummary,
  getMonthlyFinanceReport,
} from "@/features/building-finance/services";
import { getProjects } from "@/features/projects/services";
import { Header } from "@/components/layout/header";
import { MonthFilter } from "@/components/building/month-filter";
import { BuildingExpenseForm } from "./expense-form";
import { StatCard } from "@/components/dashboard/stat-card";
import { FinanceBarChart } from "@/components/dashboard/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { createMetadata } from "@/lib/seo";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertTriangle,
  Building2,
} from "lucide-react";

export const metadata = createMetadata({
  title: "داشبورد مالی",
  path: "/building-finance",
  noIndex: true,
});

type SearchParams = Promise<{ year?: string; month?: string; projectId?: string }>;

export default async function BuildingFinancePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const now = new Date();
  const year = params.year ? Number(params.year) : now.getFullYear();
  const month = params.month ? Number(params.month) : now.getMonth() + 1;
  const projectId = params.projectId || undefined;

  const [summary, report, projects] = await Promise.all([
    getBuildingFinancialSummary(projectId, { year, month }),
    getMonthlyFinanceReport(projectId),
    getProjects(),
  ]);

  const chartData = report.map((r) => ({
    name: r.label,
    income: r.payments,
    expense: r.expenses,
  }));

  return (
    <div className="space-y-6">
      <Header title="داشبورد مالی ساختمان" />
      <Suspense>
        <MonthFilter
          projects={projects.map((p) => ({ id: p.id, name: p.name }))}
        />
      </Suspense>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="کل دریافت‌ها"
          value={formatCurrency(summary.totalReceived)}
          icon={TrendingUp}
          trend="up"
        />
        <StatCard
          title="کل هزینه‌ها"
          value={formatCurrency(summary.totalExpenses)}
          icon={TrendingDown}
          trend="down"
        />
        <StatCard
          title="مانده صندوق"
          value={formatCurrency(summary.fundBalance)}
          icon={Wallet}
          trend={summary.fundBalance >= 0 ? "up" : "down"}
        />
        <StatCard
          title="بدهی معوق"
          value={formatCurrency(summary.outstandingDebt)}
          icon={AlertTriangle}
          description={`${summary.overdueCharges} شارژ معوق`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="شارژ صادرشده"
          value={formatCurrency(summary.totalCharges)}
          icon={Building2}
        />
        <StatCard
          title="پرداخت شارژ"
          value={formatCurrency(summary.totalPayments)}
          icon={TrendingUp}
        />
        <StatCard
          title="واحدهای بدهکار"
          value={String(summary.unitsWithDebt)}
          icon={AlertTriangle}
          description={formatCurrency(summary.totalUnitDebt)}
        />
        <StatCard
          title="واحدهای بستانکار"
          value={String(summary.unitsWithCredit)}
          icon={TrendingUp}
          description={formatCurrency(summary.totalUnitCredit)}
        />
      </div>

      <BuildingExpenseForm
        projects={projects.map((p) => ({ id: p.id, name: p.name }))}
      />

      <Card>
        <CardHeader>
          <CardTitle>نمودار ۶ ماه اخیر</CardTitle>
        </CardHeader>
        <CardContent>
          <FinanceBarChart data={chartData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>تراکنش‌های اخیر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-right text-muted-foreground">
                  <th className="p-2">تاریخ</th>
                  <th className="p-2">نوع</th>
                  <th className="p-2">شرح</th>
                  <th className="p-2">مبلغ</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b">
                    <td className="p-2">{formatDate(tx.date)}</td>
                    <td className="p-2">{tx.type}</td>
                    <td className="p-2">
                      {tx.description}
                      {tx.unit ? ` — واحد ${tx.unit.unitNumber}` : ""}
                    </td>
                    <td className="p-2">{formatCurrency(Number(tx.amount))}</td>
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
