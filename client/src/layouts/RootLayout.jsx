import { Outlet } from "react-router-dom";

import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";

/**
 * Root page shell: sticky navbar, routed content via <Outlet/>, footer.
 * Every route rendered through routes/AppRouter.jsx mounts inside this
 * layout. Sections control their own width/background (the landing page is
 * full-bleed with alternating section backgrounds), so `main` carries no
 * container padding of its own.
 */
export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;
