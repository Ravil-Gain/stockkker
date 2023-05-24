import { useAuth } from "@/context/authContext";
import * as React from "react";
import { LogoutButton } from "@/components/ui/LogoutButton";
import { LoginButton } from "@/components/ui/LoginButton";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export function Header() {
  const user = useAuth();
  const pathname = usePathname();

  return (
    <div className="fixed bg-slate-900 top-0 w-full h-16 left-0 flex items-center justify-between px-6 text-white md:mx-auto md:text-2xl z-10">
      <h1 className="cursor-default hidden md:block">Stockkker</h1>
      {user && user.authUser && (
       <div className="w-3/4 md:w-1/2 flex justify-around">
        <Link className={pathname === '/admin' ? 'underline' : 'no-underline'} href={'/admin/'} key={'raport'}>Raport</Link>
        <Link className={pathname === '/admin/products' ? 'underline' : 'no-underline'} href={'/admin/products'} key={'products'}>Products</Link>
        <Link className={pathname === '/admin/consumables' ? 'underline' : 'no-underline'} href={'/admin/consumables'} key={'consumables'}>Consumables</Link>
       </div>
      )}
      {user && user.authUser ? (
        <div className="flex ml-4 my-auto">
          <h1 className="cursor-default hidden md:block">{user.authUser.displayName}</h1>
          <LogoutButton />
        </div>
      ) : (
        <LoginButton />
      )}
    </div>
  );
}
