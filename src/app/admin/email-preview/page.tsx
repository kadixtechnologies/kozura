import { checkAdminAuth } from "@/lib/auth/admin";
import { redirect } from "next/navigation";
import { ClientEmailPreviewPage } from "./ClientEmailPreviewPage";

export default async function AdminEmailPreviewPage() {
  if (!(await checkAdminAuth())) {
    redirect("/admin/login");
  }

  return <ClientEmailPreviewPage />;
}
