"use client";

import { toast } from "sonner";
import { useState, useEffect, FormEvent } from "react";

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoRequestModal({
  isOpen,
  onClose,
}: DemoRequestModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to auto-fill message based on name and company
  useEffect(() => {
    const name = formData.name || "[Nombre]";
    const company = formData.company || "[Empresa]";
    setFormData((prev) => ({
      ...prev,
      message: `Hola, soy ${name} de ${company} me gustaría recibir asesoramiento sobre los servicios digitales de Medintt para mi empresa. Estoy interesado en optimizar nuestros procesos de salud laboral.`,
    }));
  }, [formData.name, formData.company]);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const mailingUrl = `${process.env.NEXT_PUBLIC_URL_ADMIN}/mailing/demo-request`;

      const payload = {
        options: {
          subject: "PETICION DE SERVICIOS WEB",
          body: `${formData.message}\n\n---\nDatos de contacto:\nEmail: ${formData.email}\nTeléfono: ${formData.phone}`,
        },
      };
      const response = await fetch(mailingUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error al enviar la solicitud");
      }

      toast.success("Solicitud enviada", {
        description:
          "Gracias por su interés. Nos pondremos en contacto pronto.",
      });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error al enviar", {
        description: "Por favor, inténtelo nuevamente más tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl md:p-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label="Cerrar modal"
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

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Solicitar Demo Personalizada
          </h2>
          <p className="mt-2 text-slate-600">
            Complete el formulario y un especialista lo contactará a la
            brevedad.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-slate-700"
              >
                Nombre
              </label>
              <input
                type="text"
                id="name"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-main-azul focus:outline-none focus:ring-1 focus:ring-main-azul"
                placeholder="Su nombre"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="company"
                className="text-sm font-semibold text-slate-700"
              >
                Empresa
              </label>
              <input
                type="text"
                id="company"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-main-azul focus:outline-none focus:ring-1 focus:ring-main-azul"
                placeholder="Nombre de su empresa"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-slate-700"
            >
              Correo Corporativo
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-main-azul focus:outline-none focus:ring-1 focus:ring-main-azul"
              placeholder="nombre@empresa.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="phone"
              className="text-sm font-semibold text-slate-700"
            >
              Teléfono de Contacto
            </label>
            <input
              type="tel"
              id="phone"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-main-azul focus:outline-none focus:ring-1 focus:ring-main-azul"
              placeholder="+54 299 ..."
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="message"
              className="text-sm font-semibold text-slate-700"
            >
              Mensaje
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-main-azul focus:outline-none focus:ring-1 focus:ring-main-azul text-slate-600"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-main-azul px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "ENVIANDO..." : "ENVIAR SOLICITUD"}
          </button>
        </form>
      </div>
    </div>
  );
}
