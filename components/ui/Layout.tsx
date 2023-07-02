import * as React from "react";
import { Header } from "./Header";

export interface ILayoutProps {
  children: any;
}

export function Layout(props: ILayoutProps) {
  const { children } = props;

  return (
    <div className="flex flex-col min-h-screen relative bg-slate-900">
      <Header />
      <main className="flex-1 bg-gray-200 mt-16 mb-6 py-5 px-2 md:pt-6 w-full md:mx-auto md:text-2xl">
        {children}
      </main>
    </div>
  );
}
