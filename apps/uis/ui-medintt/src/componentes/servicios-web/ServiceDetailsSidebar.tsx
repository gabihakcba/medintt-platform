"use client";

import { useEffect, type JSX } from "react";

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export interface ServiceFeature {
  title: string;
  description: string;
}

export interface ServiceDetails {
  title: string;
  description: string;
  features: ServiceFeature[];
}

interface ServiceDetailsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceDetails | null;
  onDemoClick: () => void;
}

export default function ServiceDetailsSidebar({
  isOpen,
  onClose,
  service,
  onDemoClick,
}: ServiceDetailsSidebarProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!service) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex justify-end transition-opacity duration-300",
        isOpen
          ? "visible opacity-100"
          : "invisible opacity-0 pointer-events-none",
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "relative h-full w-full max-w-lg transform overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-300 md:p-10",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label="Cerrar panel"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mt-8 space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl leading-tight">
              {service.title}
            </h2>
            <div className="mt-4 h-1 w-20 rounded-full bg-main-azul" />
          </div>

          {/* Description */}
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b pb-2 border-slate-100">
              Características Detalladas
            </h3>
            <ul className="space-y-6">
              {service.features.map((feature, index) => (
                <li key={index} className="flex gap-4">
                  <div className="shrink-0 mt-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-main-azul">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">
                      {feature.title}
                    </h4>
                    <p className="mt-1 text-slate-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="pt-8 mt-auto">
            <button
              onClick={onDemoClick}
              className="w-full rounded-xl bg-main-azul px-6 py-4 text-center font-bold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              SOLICITAR DEMO
            </button>
            <p className="mt-4 text-center text-xs text-slate-400">
              Prueba gratuita de 15 días sin compromiso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
