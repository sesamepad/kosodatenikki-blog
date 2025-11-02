import DesktopFooter from "@/components/desktop/DesktopFooter";
import DesktopHeader from "@/components/desktop/DesktopHeader";
import Sidebar from "@/components/desktop/Sidebar";
import "@/styles/desktop/DesktopLayout.css";
import type { ReactNode } from "react";

type Props = { children: ReactNode };

export default function DesktopLayout({ children }: Props) {
  return (
    <>
      <DesktopHeader />
      <div className="container">
        <main>{children}</main>
        <Sidebar />
      </div>
      <DesktopFooter />
    </>
  );
}
