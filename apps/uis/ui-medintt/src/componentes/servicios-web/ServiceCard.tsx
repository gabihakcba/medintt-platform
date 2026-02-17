import Link from "next/link";
import { type JSX } from "react";

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

interface ServiceCardProps {
  title: string;
  teaser: string;
  bullets: string[];
  ctaText?: string;
  ctaLink?: string; // Optional, defaults to "Solicitar Demo" stub
  onCtaClick?: () => void;
  icon: JSX.Element;
  className?: string; // For custom styles like gradient bg
}

export default function ServiceCard({
  title,
  teaser,
  bullets,
  ctaText = "Ver Detalles",
  ctaLink,
  onCtaClick,
  icon,
  className,
}: ServiceCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-main-azul hover:shadow-2xl",
        className,
      )}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-center p-4 rounded-full bg-blue-50 w-16 h-16 text-main-azul group-hover:bg-blue-100 transition-colors duration-300">
        {icon}
      </div>

      <h3 className="mb-3 text-2xl font-bold text-slate-900 group-hover:text-main-azul transition-colors">
        {title}
      </h3>

      {/* Teaser */}
      <p className="mb-6 text-lg font-medium text-slate-600 leading-relaxed">
        {teaser}
      </p>

      {/* Bullets */}
      <ul className="mb-8 space-y-3 grow">
        {bullets.map((bullet, index) => (
          <li key={index} className="flex items-start gap-3 text-slate-600">
            <svg
              className="mt-1 h-5 w-5 shrink-0 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            <span className="text-base">{bullet}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-auto pt-4 border-t border-slate-100">
        {ctaLink ? (
          <Link
            href={ctaLink}
            className="inline-flex items-center font-bold text-main-azul transition-colors hover:text-blue-700 group-hover:underline"
          >
            {ctaText}
            <svg
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        ) : (
          <button
            onClick={onCtaClick}
            type="button"
            className="inline-flex items-center font-bold text-main-azul transition-colors hover:text-blue-700 group-hover:underline"
          >
            {ctaText}
            <svg
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
