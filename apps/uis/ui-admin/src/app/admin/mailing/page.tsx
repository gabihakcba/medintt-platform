"use client";

import { useAuth } from "@/hooks/useAuth";
import { checkPermissions } from "@/services/permissions";
import { MedinttGuard } from "@medintt/ui";

export default function MailingPage() {
  const { user } = useAuth();

  return (
    <MedinttGuard
      data={user}
      validator={(u) =>
        checkPermissions(u, process.env.NEXT_PUBLIC_SELF_PROJECT!, [
          process.env.NEXT_PUBLIC_ROLE_ADMIN!,
          "REDES",
        ])
      }
    >
      <div className="p-4">
        <h1 className="text-2xl font-bold">Sección Mailing</h1>
      </div>
    </MedinttGuard>
  );
}
