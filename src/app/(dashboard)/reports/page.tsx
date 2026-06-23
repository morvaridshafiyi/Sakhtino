import { Header } from "@/components/layout/header";
import { createMetadata } from "@/lib/seo";
import { ReportsClient } from "./reports-client";
import { getFinanceOverview } from "@/features/finance/services";
import { getProjects } from "@/features/projects/services";
import { getBuildingFinancialSummary } from "@/features/building-finance/services";

export const metadata = createMetadata({
  title: "گزارش‌ها",
  path: "/reports",
  noIndex: true,
});

export default async function ReportsPage() {
  const now = new Date();
  const [finance, projects, buildingFinance] = await Promise.all([
    getFinanceOverview(),
    getProjects(),
    getBuildingFinancialSummary(undefined, {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    }),
  ]);

  return (
    <div className="space-y-6">
      <Header title="گزارش‌ها" />
      <ReportsClient
        financeSummary={{
          totalIncome: buildingFinance.totalReceived,
          totalExpense: buildingFinance.totalExpenses,
          netProfit: buildingFinance.fundBalance,
        }}
        buildingSummary={{
          totalCharges: buildingFinance.totalCharges,
          outstandingDebt: buildingFinance.outstandingDebt,
          unitsWithDebt: buildingFinance.unitsWithDebt,
          overdueCharges: buildingFinance.overdueCharges,
        }}
        projects={projects.map((p) => ({
          name: p.name,
          status: p.status,
          progress: p.progress,
          budget: Number(p.budget),
        }))}
        legacyFinance={{
          totalIncome: finance.totalIncome,
          totalExpense: finance.totalExpense,
        }}
      />
    </div>
  );
}
