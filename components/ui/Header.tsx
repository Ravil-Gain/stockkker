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
    <div className="fixed bg-white top-0 w-full h-16 left-0 flex items-center justify-between px-6 text-slate-900 md:mx-auto md:text-2xl z-10">
      <h1 className="cursor-default hidden md:block uppercase font-bold">BarBuh</h1>
      {user && user.authUser && user.authUser && (
       <div className="w-3/4 md:w-1/2 flex justify-evenly">
        {user.authUser.admin && (<Link className={pathname === '/barthender/' ? 'font-bold' : 'no-underline'} href={'/barthender/'} key={'orders'}>Orders</Link>)}
        {user.authUser.admin && (<Link className={pathname === '/barthender/checks' ? 'font-bold' : 'no-underline'} href={'/barthender/checks'} key={'checks'}>Checks</Link>)}
        {user.authUser.admin && (<Link className={pathname === '/barthender/cocktails' ? 'font-bold' : 'no-underline'} href={'/barthender/cocktails/'} key={'cocktails'}>Cocktails</Link>)}
        {user.authUser.admin && (<Link className={pathname === '/barthender/products' ? 'font-bold' : 'no-underline'} href={'/barthender/products'} key={'products'}>Products</Link>)}
        {!user.authUser.admin && (<Link className={pathname === '/client/' ? 'font-bold' : 'no-underline'} href={'/client/'} key={'menu'}>Menu</Link>)}
        {!user.authUser.admin && (<Link className={pathname === '/client/check' ? 'font-bold' : 'no-underline'} href={'/client/check/'} key={'check'}>Check</Link>)}
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
