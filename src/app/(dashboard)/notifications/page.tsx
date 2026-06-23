import { auth } from "@/lib/auth";
import { getNotifications } from "@/features/notifications/services";
import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { createMetadata } from "@/lib/seo";
import { MarkReadButton } from "./mark-read-button";

export const metadata = createMetadata({
  title: "اعلان‌ها",
  path: "/notifications",
  noIndex: true,
});

const typeLabels: Record<string, string> = {
  PAYMENT_DUE: "سررسید پرداخت",
  PROJECT_DEADLINE: "کار اجرایی",
  SALARY_REMINDER: "یادآوری حقوق",
  SYSTEM: "سیستم",
};

export default async function NotificationsPage() {
  const session = await auth();
  const notifications = session?.user
    ? await getNotifications(session.user.id)
    : [];

  return (
    <div className="space-y-6">
      <Header title="اعلان‌ها" />
      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={notification.isRead ? "opacity-70" : ""}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">{notification.title}</CardTitle>
                <Badge variant={notification.isRead ? "secondary" : "default"}>
                  {typeLabels[notification.type] ?? notification.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm">{notification.message}</p>
                <time className="text-xs text-muted-foreground">
                  {formatDate(notification.createdAt)}
                </time>
              </div>
              {!notification.isRead && (
                <MarkReadButton id={notification.id} />
              )}
            </CardContent>
          </Card>
        ))}
        {notifications.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              اعلانی وجود ندارد
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
