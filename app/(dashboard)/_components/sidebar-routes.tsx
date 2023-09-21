"use client";

import { Layout, Compass, List, BarChart } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
  {
    icon: Layout, // иконка, отображающаяся рядом с маршрутом
    label: "Dashboard", // текстовая метка, отображающаяся рядом с иконкой
    href: "/", // это сво-во указывает на URL-адрес, на который будет осуществляться переход при выборе маршрута
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: List, // иконка, отображающаяся рядом с маршрутом
    label: "Courses", // текстовая метка, отображающаяся рядом с иконкой
    href: "/teacher/courses", // это сво-во указывает на URL-адрес, на который будет осуществляться переход при выборе маршрута
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
