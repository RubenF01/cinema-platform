import type { Metadata } from "next";
import { AccountPanel } from "@/components/account-panel";

export const metadata: Metadata = {
  title: "Account | Cimena",
  description: "Manage your Cimena account, security, and saved movie lists.",
};

export default function AccountPage() {
  return <AccountPanel />;
}
