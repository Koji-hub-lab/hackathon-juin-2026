import DashboardNavbar from "@/components/layout/DashboardNavbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-slate-50">
      <DashboardNavbar />
      <div className="min-h-0 flex-1 overflow-hidden pt-14">{children}</div>
    </div>
  );
}
