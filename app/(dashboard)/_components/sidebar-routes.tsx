"use client";

import { Layout, Compass } from "lucide-react";
import { SidebarItem } from "./sidebar-item";

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

export const SidebarRoutes = () => {
  const routes = guestRoutes;

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
