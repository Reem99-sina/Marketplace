"use client";
import { ReactNode, useEffect } from "react";

import { AppSidebar } from "@/components/dashboard/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Header } from "@/components/common/header";
import { useUser } from "@/contexts/use-user";
import { Role } from "@/models/Role";

export default function HomeLayout({ children }: { children: ReactNode }) {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      {user?.role != Role.CUSTOMER ? (
        <SidebarProvider className="h-full w-full">
          <AppSidebar></AppSidebar>
          <div className="w-full min-h-screen h-full">
            <div className="flex justify-between w-full py-6 px-3">
              <SidebarTrigger />
              <Header />
            </div>
            {/* <header className="p-4 bg-blue-500 text-white">Home Header</header> */}
            <div className="flex  items-center min-h-full w-full">
              {children}
            </div>
          </div>
        </SidebarProvider>
      ) : (
        <div className="h-full w-full">
          {" "}
          <Header />
          <div className="flex  items-center min-h-full w-full justify-center">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
