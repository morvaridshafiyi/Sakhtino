import {
  PrismaClient,
  Role,
  ProjectStatus,
  UnitType,
  ResidentType,
  PaymentStatus,
  MaintenanceStatus,
  MaintenancePriority,
  FinancialTransactionType,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@construction.local" },
    update: {},
    create: {
      email: "admin@construction.local",
      name: "مدیر ارشد",
      password,
      role: Role.SUPER_ADMIN,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@construction.local" },
    update: { name: "مدیر ساختمان" },
    create: {
      email: "manager@construction.local",
      name: "مدیر ساختمان",
      password,
      role: Role.BUILDING_MANAGER,
    },
  });

  let building = await prisma.project.findFirst({
    where: { name: "مجتمع مسکونی آفتاب" },
  });

  if (!building) {
    building = await prisma.project.create({
      data: {
        name: "مجتمع مسکونی آفتاب",
        description: "مجتمع ۱۲ واحدی مسکونی با پارکینگ",
        address: "تهران، منطقه ۲، خیابان ولیعصر",
        status: ProjectStatus.IN_PROGRESS,
        progress: 100,
        budget: 2000000000,
        managerId: manager.id,
      },
    });
  }

  const unitData = [
    { unitNumber: "101", floor: 1, baseCharge: 3500000 },
    { unitNumber: "102", floor: 1, baseCharge: 3200000 },
    { unitNumber: "201", floor: 2, baseCharge: 3800000 },
    { unitNumber: "202", floor: 2, baseCharge: 3600000 },
    { unitNumber: "301", floor: 3, baseCharge: 4000000 },
    { unitNumber: "P1", floor: -1, baseCharge: 1500000, type: UnitType.PARKING },
  ];

  const units = [];
  for (const u of unitData) {
    const unit = await prisma.unit.upsert({
      where: {
        projectId_unitNumber: {
          projectId: building.id,
          unitNumber: u.unitNumber,
        },
      },
      update: {},
      create: {
        projectId: building.id,
        unitNumber: u.unitNumber,
        floor: u.floor,
        area: 95,
        type: u.type ?? UnitType.RESIDENTIAL,
        baseCharge: u.baseCharge,
      },
    });
    units.push(unit);
  }

  const residents = [
    { unit: "101", name: "حسین رضایی", type: ResidentType.OWNER, phone: "09121111111" },
    { unit: "102", name: "مریم کریمی", type: ResidentType.TENANT, phone: "09122222222" },
    { unit: "201", name: "امیر نوری", type: ResidentType.OWNER, phone: "09123333333" },
    { unit: "202", name: "سارا احمدی", type: ResidentType.OWNER, phone: "09124444444" },
    { unit: "301", name: "محمد جعفری", type: ResidentType.TENANT, phone: "09125555555" },
  ];

  for (const r of residents) {
    const unit = units.find((u) => u.unitNumber === r.unit)!;
    const existing = await prisma.resident.findFirst({
      where: { unitId: unit.id, name: r.name },
    });
    if (!existing) {
      await prisma.resident.create({
        data: {
          unitId: unit.id,
          name: r.name,
          type: r.type,
          phone: r.phone,
          moveInDate: new Date("2024-01-01"),
        },
      });
    }
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const dueDate = new Date(year, month - 1, 10);

  for (const unit of units.filter((u) => u.type === UnitType.RESIDENTIAL)) {
    const existing = await prisma.monthlyCharge.findUnique({
      where: { unitId_year_month: { unitId: unit.id, year, month } },
    });
    if (!existing) {
      const charge = await prisma.monthlyCharge.create({
        data: {
          unitId: unit.id,
          projectId: building.id,
          year,
          month,
          amount: unit.baseCharge,
          dueDate,
          description: `شارژ ${month}/${year}`,
        },
      });
      await prisma.financialTransaction.create({
        data: {
          projectId: building.id,
          unitId: unit.id,
          type: FinancialTransactionType.CHARGE,
          amount: unit.baseCharge,
          description: `شارژ واحد ${unit.unitNumber}`,
          referenceId: charge.id,
          referenceType: "MonthlyCharge",
          category: "شارژ ماهانه",
        },
      });
    }
  }

  const unit101 = units.find((u) => u.unitNumber === "101")!;
  const charge101 = await prisma.monthlyCharge.findUnique({
    where: { unitId_year_month: { unitId: unit101.id, year, month } },
  });

  if (charge101 && Number(charge101.paidAmount) === 0) {
    const fullPay = Number(charge101.amount);
    const payment = await prisma.unitPayment.create({
      data: {
        unitId: unit101.id,
        projectId: building.id,
        monthlyChargeId: charge101.id,
        amount: fullPay,
        method: "انتقال بانکی",
        reference: "TRX-1001",
      },
    });
    await prisma.monthlyCharge.update({
      where: { id: charge101.id },
      data: { paidAmount: fullPay, status: PaymentStatus.PAID },
    });
    await prisma.financialTransaction.create({
      data: {
        projectId: building.id,
        unitId: unit101.id,
        type: FinancialTransactionType.PAYMENT,
        amount: fullPay,
        description: "پرداخت کامل شارژ",
        referenceId: payment.id,
        referenceType: "UnitPayment",
        category: "شارژ",
      },
    });
  }

  const unit201 = units.find((u) => u.unitNumber === "201")!;
  const charge201 = await prisma.monthlyCharge.findUnique({
    where: { unitId_year_month: { unitId: unit201.id, year, month } },
  });

  if (charge201 && Number(charge201.paidAmount) === 0) {
    const partial = Math.floor(Number(charge201.amount) * 0.5);
    const payment = await prisma.unitPayment.create({
      data: {
        unitId: unit201.id,
        projectId: building.id,
        monthlyChargeId: charge201.id,
        amount: partial,
        method: "نقد",
      },
    });
    await prisma.monthlyCharge.update({
      where: { id: charge201.id },
      data: { paidAmount: partial, status: PaymentStatus.PARTIAL },
    });
    await prisma.financialTransaction.create({
      data: {
        projectId: building.id,
        unitId: unit201.id,
        type: FinancialTransactionType.PAYMENT,
        amount: partial,
        description: "پرداخت ناقص شارژ",
        referenceId: payment.id,
        referenceType: "UnitPayment",
        category: "شارژ",
      },
    });
  }

  const expenseExists = await prisma.expense.findFirst({
    where: { projectId: building.id, title: "تعمیر آسانسور" },
  });
  if (!expenseExists) {
    const expense = await prisma.expense.create({
      data: {
        projectId: building.id,
        title: "تعمیر آسانسور",
        amount: 15000000,
        category: "تعمیرات",
        date: new Date(),
      },
    });
    await prisma.financialTransaction.create({
      data: {
        projectId: building.id,
        type: FinancialTransactionType.EXPENSE,
        amount: 15000000,
        description: "تعمیر آسانسور",
        referenceId: expense.id,
        referenceType: "Expense",
        category: "تعمیرات",
      },
    });
  }

  const taskExists = await prisma.maintenanceTask.findFirst({
    where: { projectId: building.id, title: "نظافت مشاعات هفتگی" },
  });
  if (!taskExists) {
    await prisma.maintenanceTask.create({
      data: {
        projectId: building.id,
        title: "نظافت مشاعات هفتگی",
        description: "نظافت راه‌پله، لابی و پارکینگ",
        category: "CLEANING",
        status: MaintenanceStatus.IN_PROGRESS,
        priority: MaintenancePriority.MEDIUM,
        assignedTo: "خدمات نظافت",
      },
    });
    await prisma.maintenanceTask.create({
      data: {
        projectId: building.id,
        title: "تعمیر رنگ‌آمیزی پارکینگ",
        description: "خط‌کشی و رنگ پارکینگ طبقه منفی یک",
        category: "PARKING",
        status: MaintenanceStatus.PENDING,
        priority: MaintenancePriority.HIGH,
        estimatedCost: 8000000,
        assignedTo: "پیمانکار پارکینگ",
      },
    });
    await prisma.maintenanceTask.create({
      data: {
        projectId: building.id,
        unitId: units.find((u) => u.unitNumber === "102")!.id,
        title: "تعویض لامپ راه‌پله",
        description: "لامپ‌های سوخته طبقه ۱",
        category: "LIGHTING",
        status: MaintenanceStatus.PENDING,
        priority: MaintenancePriority.MEDIUM,
        assignedTo: "تاسیسات",
      },
    });
  }

  await prisma.worker.upsert({
    where: { nationalId: "0012345678" },
    update: {},
    create: {
      firstName: "علی",
      lastName: "محمدی",
      nationalId: "0012345678",
      position: "سرایدار",
      phone: "09121234567",
      monthlySalary: 25000000,
    },
  });

  let contractor = await prisma.contractor.findFirst({
    where: { name: "سرویس آسانسور پارس" },
  });
  if (!contractor) {
    contractor = await prisma.contractor.create({
      data: {
        name: "سرویس آسانسور پارس",
        company: "پارس آسانسور",
        specialty: "آسانسور",
        phone: "02188776655",
      },
    });
  }

  const notifExists = await prisma.notification.findFirst({
    where: { userId: admin.id, title: "خوش آمدید" },
  });
  if (!notifExists) {
    await prisma.notification.create({
      data: {
        userId: admin.id,
        type: "SYSTEM",
        title: "خوش آمدید",
        message: "سامانه مدیریت ساختمان با موفقیت راه‌اندازی شد.",
      },
    });
  }

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
