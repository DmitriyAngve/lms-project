import { NavbarRouters } from "@/components/navbar-routes";
import { MobileSidebar } from "./mobile-sidebar";

export const Navbar = () => {
  return (
    <div className="p-4 border-4 h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <NavbarRouters />
    </div>
  );
};
