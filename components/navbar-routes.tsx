"use client";
import { usePathname, useRouter } from "next/navigation";

import { UserButton } from "@clerk/nextjs";

export const NavbarRouters = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex gap-x-2 ml-auto">
      <UserButton />
    </div>
  );
};
