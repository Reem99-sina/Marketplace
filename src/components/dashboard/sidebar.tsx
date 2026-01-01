"use client";
import { Calendar, Home, Inbox, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@/contexts/use-user";
import { useMemo } from "react";
import { Role } from "@/models/Role";

// Menu items.
const itemsNav = [
  {
    title: "Store",
    url: "/store",
    icon: Home,
  },
  {
    title: "products",
    url: "/product",
    icon: Inbox,
  },
  {
    title: "orders",
    url: "/order",
    icon: Calendar,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const { user } = useUser();

  const items = useMemo(() => {
    return user?.role == Role.VENDOR || user?.role == Role.ADMIN
      ? itemsNav
      : [];
  }, [user]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
