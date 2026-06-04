import DashboardNavbar from "@/components/layout/DashboardNavbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="relative -m-6 flex h-full min-h-0 flex-col overflow-hidden bg-[#080b11]">
      <DashboardNavbar />
      <div className="min-h-0 flex-1 overflow-hidden pt-14">{children}</div>
    </div>
  );
}
