"use client";

import { useState, type JSX } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PhoneIcon, QuestionIcon, type IconProps } from "../shared/Icons";

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

type DesktopNavbarProps = {
  navLinks: NavLink[];
  medicinaMenu: SubMenuSection[];
};

const iconLinks: Record<string, (props: IconProps) => JSX.Element> = {
  "/contacto": PhoneIcon,
  "/preguntas-frecuentes": QuestionIcon,
};

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export default function DesktopNavbar({
  navLinks,
  medicinaMenu,
}: DesktopNavbarProps) {
  const [isMedicinaOpen, setIsMedicinaOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const desktopLinkClasses = (href: string) =>
    cn(
      "inline-flex items-center gap-1 border-b-2 border-transparent transition",
      "hover:border-main-azul hover:text-main-azul hover:font-bold",
      isActive(href)
        ? "font-bold text-main-azul border-main-azul"
        : "text-main-azul/80"
    );

  return (
    <nav className="hidden items-center justify-end md:flex">
      <ul className="flex flex-wrap items-center gap-4 text-sm font-secondary text-main-azul/80 md:gap-6 md:text-md lg:gap-8 lg:text-lg xl:gap-16">
        {navLinks.map(({ href, label, showCaret }) => {
          if (href === "/medicina-laboral") {
            return (
              <li
                key={href}
                className="relative"
                onMouseEnter={() => setIsMedicinaOpen(true)}
                onMouseLeave={(event) => {
                  const nextTarget = event.relatedTarget as Node | null;
                  if (
                    !nextTarget ||
                    !event.currentTarget.contains(nextTarget)
                  ) {
                    setIsMedicinaOpen(false);
                  }
                }}
                onBlur={(event) => {
                  if (
                    !event.currentTarget.contains(
                      event.relatedTarget as Node | null
                    )
                  ) {
                    setIsMedicinaOpen(false);
                  }
                }}
              >
                <button
                  type="button"
                  className={cn(desktopLinkClasses(href), "items-center gap-2")}
                  onClick={() => setIsMedicinaOpen((prev) => !prev)}
                  onFocus={() => setIsMedicinaOpen(true)}
                  aria-expanded={isMedicinaOpen}
                  aria-haspopup="true"
                >
                  <span>{label}</span>
                  {showCaret ? (
                    <svg
                      aria-hidden
                      className={cn(
                        "h-3 w-3 transition",
                        isActive(href) ? "text-main-azul" : "text-main-azul/80",
                        isMedicinaOpen && "rotate-180"
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
                {isMedicinaOpen ? (
                  <div
                    className="absolute left-1/2 top-full z-50 -translate-x-1/2"
                    onMouseEnter={() => setIsMedicinaOpen(true)}
                    onMouseLeave={(event) => {
                      const nextTarget = event.relatedTarget as Node | null;
                      if (
                        !nextTarget ||
                        !event.currentTarget.contains(nextTarget)
                      ) {
                        setIsMedicinaOpen(false);
                      }
                    }}
                  >
                    <div className="h-4 w-full" aria-hidden="true" />
                    <div className="w-[28rem] rounded-3xl border border-main-azul/10 bg-white p-6 shadow-xl">
                      <div className="grid grid-cols-2 gap-6">
                        {medicinaMenu.map(({ heading, items }) => (
                          <div key={heading} className="space-y-2">
                            <p className="text-sm font-semibold uppercase tracking-wide text-main-azul/80">
                              {heading}
                            </p>
                            <ul className="space-y-2">
                              {items.map((item) => (
                                <li key={item.href}>
                                  <Link
                                    href={item.href}
                                    className="block border-b border-main-azul/30 pb-1 text-sm font-medium text-main-azul transition hover:text-main-azul/70"
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          }

          const Icon = iconLinks[href];

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={desktopLinkClasses(href)}
              >
                {Icon ? (
                  <>
                    <Icon className="h-5 w-5 xl:hidden" aria-hidden />
                    <span className="hidden xl:inline">{label}</span>
                    <span className="sr-only xl:hidden">{label}</span>
                  </>
                ) : (
                  <span>{label}</span>
                )}
                {showCaret ? (
                  <svg
                    aria-hidden
                    className={cn(
                      "h-3 w-3 transition",
                      isActive(href) ? "text-main-azul" : "text-main-azul/80"
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
    </nav>
  );
}
