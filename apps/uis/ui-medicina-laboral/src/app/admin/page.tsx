"use client";

import { useAuth } from "@/hooks/useAuth";
import { checkPermissions } from "@/services/permissions";
import { MedinttGuard } from "@medintt/ui";
import { useInterlocutor } from "@/hooks/useInterlocutor";

export default function AdminPage() {
  const { user } = useAuth();
  const { interlocutor, isLoading } = useInterlocutor();

  return (
    <MedinttGuard
      data={user}
      validator={(u) =>
        checkPermissions(u, process.env.NEXT_PUBLIC_SELF_PROJECT!, [
          process.env.NEXT_PUBLIC_ROLE_ADMIN!,
          process.env.NEXT_PUBLIC_ROLE_INTERLOCUTOR!,
        ])
      }
    >
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Panel de Medicina Laboral</h1>

        {/* Interlocutor Information Card */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <p>Cargando información...</p>
          </div>
        ) : interlocutor ? (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Información personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-medium">
                  {interlocutor.name + " " + interlocutor.lastName || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{interlocutor.email || "-"}</p>
              </div>
              {interlocutor.organization && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Empresa</p>
                    <p className="font-medium">
                      {interlocutor.organization.name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">CUIT</p>
                    <p className="font-medium">
                      {interlocutor.organization.cuit || "-"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : null}

        {/* Welcome Message */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-blue-700">
            Bienvenido al panel de Medicina Laboral. Utiliza el menú lateral
            para acceder a las diferentes secciones.
          </p>
        </div>
      </div>
    </MedinttGuard>
  );
}
