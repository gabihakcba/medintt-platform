"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { refresh, logout } from "@/queries/auth";
import { User } from "@medintt/types-auth/dist/auth/user.type";
import { TYPE_LOGIN } from "@medintt/types-auth/dist/auth/login.type";

export function useAuth() {
  const queryClient = useQueryClient();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Consulta para verificar la sesión al montar (o revalidar)
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      try {
        const res: { user: User } = await refresh();
        return res.user;
      } catch (error) {
        return null;
      }
    },
    retry: false, // No reintentar si falla (significa no logueado)
    staleTime: 1000 * 60 * 5, // 5 minutos de caché
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["auth-user"], null);
    },
  });

  // Escuchar mensajes del iframe (ui-auth)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verificar origen si es necesario por seguridad
      // if (event.origin !== process.env.NEXT_PUBLIC_AUTH_FRONT) return;

      const { type, user: loggedUser } = event.data;

      if (type === TYPE_LOGIN.SUCCESS && loggedUser) {
        queryClient.setQueryData(["auth-user"], loggedUser);
        setShowLoginModal(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [queryClient]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    showLoginModal,
    setShowLoginModal,
    logout: () => logoutMutation.mutate(),
  };
}
