import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";
import {
  Building2,
  Wallet,
  Wrench,
  Smartphone,
} from "lucide-react";

export const metadata = createMetadata({
  title: "صفحه اصلی",
  description:
    "سامانه مدیریت ساختمان برای شارژ ماهانه، پرداخت‌ها، هزینه‌ها و کارهای اجرایی نظافت و تعمیرات",
});

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  const features = [
    {
      icon: Wallet,
      title: "مدیریت مالی",
      description: "شارژ ماهانه، پرداخت، بدهی، بستانکاری و مانده صندوق",
    },
    {
      icon: Wrench,
      title: "کارهای اجرایی",
      description: "نظافت، تعمیر پارکینگ، روشنایی، تأسیسات و پیگیری وضعیت",
    },
    {
      icon: Building2,
      title: "واحدها و ساکنین",
      description: "مدیریت واحدها، ساکنین و اطلاعات تماس",
    },
    {
      icon: Smartphone,
      title: "ساده و فارسی",
      description: "رابط کاربری RTL، موبایل‌فرست و مناسب مدیر ساختمان",
    },
  ];

  return (
    <main className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <span className="text-xl font-bold">مدیریت ساختمان</span>
          <Button asChild>
            <Link href="/login">ورود به سامانه</Link>
          </Button>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          سامانه مدیریت مالی و اجرایی ساختمان
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          شارژ واحدها، پیگیری پرداخت‌ها، ثبت هزینه‌ها و مدیریت کارهای روزمره
          مثل نظافت و تعمیرات — همه در یک پنل
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/login">شروع کنید</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#features">ویژگی‌ها</Link>
          </Button>
        </div>
      </section>

      <section id="features" className="border-t bg-muted/30 py-16">
        <div className="container mx-auto grid gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="rounded-xl border bg-card p-6 shadow-sm"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="text-lg font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} سامانه مدیریت ساختمان — تمامی حقوق محفوظ است
      </footer>
    </main>
  );
}
