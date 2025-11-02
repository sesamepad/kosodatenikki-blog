declare module "react-markdown/lib/ast-to-react";
import { ReactNode } from "react";

export interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
  [key: string]: any;
}
