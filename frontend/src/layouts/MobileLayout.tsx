import MobileFooter from "@/components/mobile/MobileFooter";
import MobileHeader from "@/components/mobile/MobileHeader";
import "@/styles/mobile/MobileLayout.css";
import type { ReactNode } from "react";

type Props = { children: ReactNode };

export default function MobileLayout({ children }: Props) {
  return (
    <>
      <MobileHeader />
      <main className="mobile-main">{children}</main>
      <MobileFooter />
    </>
  );
}
