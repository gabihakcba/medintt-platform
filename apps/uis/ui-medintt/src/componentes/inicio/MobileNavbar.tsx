"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PhoneIcon } from "../shared/Icons";

type NavLink = {
  href: string;
  label: string;
  showCaret?: boolean;
};

type SubMenuItem = {
  href: string;
  label: string;
};

type SubMenuSection = {
  heading: string;
  items: SubMenuItem[];
};

type MobileNavbarProps = {
  navLinks: NavLink[];
  medicinaMenu: SubMenuSection[];
};

const quickLinks = [{ href: "/contacto", label: "Contacto", Icon: PhoneIcon }];

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export default function MobileNavbar({
  navLinks,
  medicinaMenu,
}: MobileNavbarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileMedicinaOpen, setIsMobileMedicinaOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const mobileLinkClasses = (href: string) =>
    cn(
      "flex items-center justify-between py-3 text-lg",
      isActive(href) ? "font-bold text-main-azul" : "text-main-azul/80"
    );

  return (
    <>
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-main-azul/20 text-main-azul transition hover:border-main-azul hover:bg-main-azul/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-main-azul focus-visible:ring-offset-2 md:hidden"
        aria-expanded={isMobileOpen}
        aria-controls="mobile-menu"
        aria-label={isMobileOpen ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setIsMobileOpen((prev) => !prev)}
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          {isMobileOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <div className="flex items-center gap-3 md:hidden">
        {quickLinks.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full border border-main-azul/20 text-main-azul transition hover:border-main-azul hover:bg-main-azul/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-main-azul focus-visible:ring-offset-2",
              isActive(href) && "border-main-azul bg-main-azul/5"
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </Link>
        ))}
      </div>

      {isMobileOpen ? (
        <div
          id="mobile-menu"
          className="absolute left-0 top-full w-full border-t border-main-azul/10 bg-white px-6 pb-6 md:hidden shadow-lg"
        >
          <ul className="flex flex-col font-secondary">
            {navLinks.map(({ href, label, showCaret }) => {
              if (href === "/medicina-laboral") {
                return (
                  <li
                    key={`mobile-${href}`}
                    className="border-b border-main-azul/10 last:border-none"
                  >
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between py-3 text-lg",
                        isActive(href)
                          ? "font-bold text-main-azul"
                          : "text-main-azul/80"
                      )}
                      onClick={() => setIsMobileMedicinaOpen((prev) => !prev)}
                      aria-expanded={isMobileMedicinaOpen}
                    >
                      <span>{label}</span>
                      {showCaret ? (
                        <svg
                          aria-hidden
                          className={cn(
                            "h-4 w-4 transition",
                            isActive(href)
                              ? "text-main-azul"
                              : "text-main-azul/60",
                            isMobileMedicinaOpen && "rotate-180"
                          )}
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
                      ) : null}
                    </button>
                    {isMobileMedicinaOpen ? (
                      <div className="mb-3 space-y-4 pl-4">
                        {medicinaMenu.map(({ heading, items }) => (
                          <div key={`mobile-${heading}`} className="space-y-2">
                            <p className="text-sm font-semibold uppercase tracking-wide text-main-azul/70">
                              {heading}
                            </p>
                            <ul className="space-y-2">
                              {items.map((item) => (
                                <li key={`mobile-${item.href}`}>
                                  <Link
                                    href={item.href}
                                    className="block border-b border-main-azul/20 pb-1 text-sm text-main-azul/80"
                                    onClick={() => setIsMobileOpen(false)}
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </li>
                );
              }

              return (
                <li
                  key={`mobile-${href}`}
                  className="border-b border-main-azul/10 last:border-none"
                >
                  <Link
                    href={href}
                    aria-current={isActive(href) ? "page" : undefined}
                    className={mobileLinkClasses(href)}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <span>{label}</span>
                    {showCaret ? (
                      <svg
                        aria-hidden
                        className={cn(
                          "h-4 w-4 transition",
                          isActive(href)
                            ? "text-main-azul"
                            : "text-main-azul/60"
                        )}
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
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </>
  );
}
