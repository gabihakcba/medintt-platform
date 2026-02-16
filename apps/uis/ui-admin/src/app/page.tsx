"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MedinttButton } from "@medintt/ui";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const {
    user,
    isAuthenticated,
    isLoading,
    showLoginModal,
    setShowLoginModal,
    logout,
  } = useAuth();
  const router = useRouter();

  const hasAccess =
    user?.isSuperAdmin ||
    user?.members?.some(
      (member: any) =>
        member.project.code === process.env.NEXT_PUBLIC_SELF_PROJECT,
    );

  useEffect(() => {
    if (!isLoading && isAuthenticated && hasAccess) {
      router.push("/admin");
    }
  }, [isAuthenticated, isLoading, router, hasAccess]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <p>Cargando...</p>
      </main>
    );
  }

  if (isAuthenticated && !hasAccess) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
          <p>
            No tienes permisos para acceder a esta aplicación. Si crees que es
            un error, contáctate con nosotros.
          </p>
          <MedinttButton onClick={() => logout()}>Cerrar Sesión</MedinttButton>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col items-center gap-8">
        <Image
          src="/logo_no_bg.png"
          alt="Admin Logo"
          width={400}
          height={400}
          priority
        />
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold">Bienvenido a Admin</h1>
          <p>Por favor, inicia sesión para continuar.</p>
          <MedinttButton onClick={() => setShowLoginModal(true)}>
            Iniciar Sesión
          </MedinttButton>
        </div>
      </div>

      <AuthModal
        visible={showLoginModal}
        onHide={() => setShowLoginModal(false)}
      />
    </main>
  );
}
