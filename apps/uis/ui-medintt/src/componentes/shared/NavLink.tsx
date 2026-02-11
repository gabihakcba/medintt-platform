"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

type NavLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  showCaret?: boolean;
  isMedicinaOpen?: boolean;
};

export default function NavLink({
  href,
  children,
  className = "",
  activeClassName = "",
  inactiveClassName = "",
  showCaret = false,
  isMedicinaOpen = false,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  const finalClassName = `${className} ${
    isActive ? activeClassName : inactiveClassName
  }`.trim();

  return (
    <Link
      href={href}
      className={finalClassName}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
      {showCaret && (
        <svg
          aria-hidden
          className={`h-3 w-3 transition ${
            isActive ? "text-main-azul" : "text-main-azul/80"
          } ${isMedicinaOpen ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 4.5L6 8.5L10 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </Link>
  );
}
