import DashboardNavbar from "@/components/layout/DashboardNavbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="relative -m-6 flex h-full min-h-0 flex-col overflow-hidden bg-black">
      <DashboardNavbar />
      <div className="min-h-0 flex-1 overflow-hidden pt-12">{children}</div>
    </div>
  );
}
