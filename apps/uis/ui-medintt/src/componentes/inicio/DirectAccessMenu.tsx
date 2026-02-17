"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

const directAccessItems = [
  {
    href: process.env.NEXT_PUBLIC_URL_ADMIN || "#",
    label: "Administración",
    icon: "/apps/admin/icono_no_bg.png",
  },
  {
    href: process.env.NEXT_PUBLIC_URL_LABORAL || "#",
    label: "Medicina Laboral",
    icon: "/apps/medicina-laboral/icono_no_bg.png",
  },
  {
    href: process.env.NEXT_PUBLIC_URL_CLOUD || "#",
    label: "Cloud Medintt",
    icon: "/apps/cloud/icono_no_bg.png",
  },
  {
    href: process.env.NEXT_PUBLIC_URL_CLUB || "#",
    label: "Club Salud",
    icon: "/apps/club-salud/icono_no_bg.png",
  },
];

export default function DirectAccessMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={(event) => {
        const nextTarget = event.relatedTarget as Node | null;
        if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
          setIsOpen(false);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 border-b-2 border-transparent transition text-main-azul/80 hover:text-main-azul hover:font-bold",
          isOpen && "font-bold text-main-azul",
        )}
        onClick={() => setIsOpen((prev) => !prev)}
        onFocus={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>Apps</span>
        <svg
          aria-hidden
          className={cn(
            "h-3 w-3 transition",
            isOpen ? "rotate-180 text-main-azul" : "text-main-azul/80",
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
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full z-50 pt-4" // pt-4 acts as the spacer
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={(event) => {
            const nextTarget = event.relatedTarget as Node | null;
            if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
              setIsOpen(false);
            }
          }}
        >
          <div className="w-64 rounded-xl border border-main-azul/10 bg-white p-4 shadow-xl">
            <ul className="grid grid-cols-2 gap-4">
              {directAccessItems.map((item, index) => (
                <li key={index} className="flex flex-col items-center gap-2">
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 transition hover:scale-105"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 border border-slate-100 shadow-sm p-2">
                      <Image
                        src={item.icon}
                        alt={item.label}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xs font-medium text-main-azul text-center">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}
