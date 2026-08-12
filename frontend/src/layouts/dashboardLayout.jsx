import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AppSidebar from "../components/AppSidebar";
import useAuthStore from "../store/authStore";


function DashboardLayout({ children }) {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const userName = user?.name || "Admin";

  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-18 items-center border-b bg-background px-4">

          {/* Bagian kiri */}
          <div className="flex items-center">
            <SidebarTrigger />

            <h1 className="ml-4 font-semibold">
              Secure UNSIA Digital Library
            </h1>
          </div>

          {/* Bagian kanan */}
          <div className="ml-auto">
<DropdownMenu>
  <DropdownMenuTrigger
    render={
      <Button
        variant="ghost"
        className="flex h-12 items-center gap-3 px-2"
      />
    }
  >
    <Avatar className="h-9 w-9">
      <AvatarFallback>
        {userInitial}
      </AvatarFallback>
    </Avatar>

    <div className="hidden text-left sm:block">
      <p className="text-sm font-medium">
        {userName}
      </p>

      <p className="text-xs text-muted-foreground">
        Administrator
      </p>
    </div>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="end"
    sideOffset={8}
    className="w-48"
  >
    <DropdownMenuGroup>
      <DropdownMenuLabel>
        Akun
      </DropdownMenuLabel>

      <DropdownMenuItem
        onClick={handleLogout}
        variant="destructive"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
          </div>

        </header>

        <main className="p-6">
          {children}
        </main>

      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardLayout;