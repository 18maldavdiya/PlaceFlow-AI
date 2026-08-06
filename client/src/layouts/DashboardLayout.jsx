import { useState } from "react";
import { Outlet } from "react-router-dom";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";

/**
 * Shell for every dashboard route — sidebar + top navbar + routed content.
 * Separate from RootLayout (marketing chrome) and AuthLayout (auth pages);
 * this one owns the app-shell pattern (fixed sidebar, sticky top bar,
 * scrollable content) that Recruiter/TPO/Admin dashboards will reuse later.
 */
export function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar onOpenSidebar={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
