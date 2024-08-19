"use client";

import { cn } from "@/lib/utils";
import { useSidebarToggle } from "@/zustand/use-sidebarToggle";
import { useStore } from "@/zustand/use-store";
import { Sidebar } from "./sidebar";
// import { Footer } from "@/components/admin-panel/footer";
// import { Sidebar } from "@/components/admin-panel/sidebar";
// import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";

export default function TutorialLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        {children}
      </main>
    </>
  );
}
