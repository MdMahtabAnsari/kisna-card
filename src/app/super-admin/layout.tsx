import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="w-full h-full flex justify-center items-center overflow-auto">
      {children}
    </div>
  );
}
