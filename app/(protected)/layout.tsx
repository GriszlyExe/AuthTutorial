'use client'

import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default async function  ProtectedLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const pathname = usePathname();
    return (
      <div className="h-full w-full flex flex-col justify-center items-center bg-pink-200 gap-y-10">
        <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm">
            <div className="flex gap-x-2">
                <Button 
                asChild
                variant={pathname === '/server' ? 'default' : 'outline'}
                >
                    <Link href="/server">Server</Link>
                </Button>
                <Button 
                asChild
                variant={pathname === '/client' ? 'default' : 'outline'}
                >
                    <Link href="/client">Client</Link>
                </Button>
                <Button 
                asChild
                variant={pathname === '/admin' ? 'default' : 'outline'}
                >
                    <Link href="/admin">Admin</Link>
                </Button>
                <Button 
                asChild
                variant={pathname === '/settings' ? 'default' : 'outline'}
                >
                    <Link href="/settings">Setting</Link>
                </Button>
            </div>
            <UserButton/>
        </nav>
        {children}
      </div>
    );
  }