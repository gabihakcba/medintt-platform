"use client";
import { MedinttButton } from "@medintt/ui";

export default function Home() {
  return (
    <div className="max-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-slate-800">
          🧪 Medintt UI Lab
        </h1>

        <section className="">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-slate-700">
              Botones con Semántica de Negocio
            </h2>
            <div className="flex flex-row flex-wrap gap-4 items-center p-2 border-2">
              <MedinttButton
                label="Crear Nuevo"
                icon="pi pi-plus"
                severity="success"
              />

              <MedinttButton
                label="Editar Registro"
                icon="pi pi-pencil"
                severity="warning"
              />

              <MedinttButton
                label="Eliminar Definitivo"
                icon="pi pi-trash"
                severity="danger"
              />

              <MedinttButton
                label="Ver Historial"
                icon="pi pi-history"
                severity="info"
              />

              <MedinttButton
                label="Habilitar cambio con historial"
                icon="pi pi-pen-to-square"
                severity="help"
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h2 className="text-xl font-semibold mb-4 text-slate-700">
              Prueba de Layout (Tailwind Merge)
            </h2>
            <p className="mb-2 text-slate-500">
              Este botón debe ocupar el 100% y tener margen superior:
            </p>

            <MedinttButton
              label="Guardar Cambios Globales"
              icon="pi pi-check"
              severity="info"
              className="w-full mt-2"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
