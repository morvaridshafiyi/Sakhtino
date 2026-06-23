"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  buildFinancialSummary,
  exportToExcel,
  exportToPDF,
} from "@/features/reports/export";
import { formatCurrency } from "@/lib/utils";

type ReportsClientProps = {
  financeSummary: {
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
  };
  buildingSummary: {
    totalCharges: number;
    outstandingDebt: number;
    unitsWithDebt: number;
    overdueCharges: number;
  };
  projects: Array<{
    name: string;
    status: string;
    progress: number;
    budget: number;
  }>;
  legacyFinance?: {
    totalIncome: number;
    totalExpense: number;
  };
};

export function ReportsClient({
  financeSummary,
  buildingSummary,
  projects,
}: ReportsClientProps) {
  const financialData = buildFinancialSummary({
    ...financeSummary,
    period: "گزارش کلی",
  });

  function exportFinancialPDF() {
    exportToPDF(
      "گزارش مالی",
      ["metric", "value"],
      financialData,
      "financial-report",
    );
  }

  function exportFinancialExcel() {
    exportToExcel(financialData, "مالی", "financial-report");
  }

  function exportBuildingsPDF() {
    exportToPDF(
      "گزارش ساختمان‌ها",
      ["name", "status", "progress", "budget"],
      projects,
      "buildings-report",
    );
  }

  function exportBuildingsExcel() {
    exportToExcel(projects, "ساختمان‌ها", "buildings-report");
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>گزارش مالی ساختمان</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>کل دریافت‌ها</span>
              <span>{formatCurrency(financeSummary.totalIncome)}</span>
            </li>
            <li className="flex justify-between">
              <span>کل هزینه‌ها</span>
              <span>{formatCurrency(financeSummary.totalExpense)}</span>
            </li>
            <li className="flex justify-between font-medium">
              <span>مانده صندوق</span>
              <span>{formatCurrency(financeSummary.netProfit)}</span>
            </li>
            <li className="flex justify-between">
              <span>شارژ صادرشده</span>
              <span>{formatCurrency(buildingSummary.totalCharges)}</span>
            </li>
            <li className="flex justify-between">
              <span>بدهی معوق</span>
              <span>{formatCurrency(buildingSummary.outstandingDebt)}</span>
            </li>
            <li className="flex justify-between">
              <span>واحدهای بدهکار</span>
              <span>{buildingSummary.unitsWithDebt}</span>
            </li>
          </ul>
          <div className="flex gap-2">
            <Button onClick={exportFinancialPDF}>PDF</Button>
            <Button variant="outline" onClick={exportFinancialExcel}>
              Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>گزارش ساختمان‌ها</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {projects.length} ساختمان ثبت شده
          </p>
          <div className="flex gap-2">
            <Button onClick={exportBuildingsPDF}>PDF</Button>
            <Button variant="outline" onClick={exportBuildingsExcel}>
              Excel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
