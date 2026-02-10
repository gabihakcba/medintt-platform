"use client";

import { Card } from "primereact/card";
import { Message } from "primereact/message";

export default function DeclaracionJuradaIndexPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg text-center">
        <div className="flex flex-col items-center gap-4">
          <i className="pi pi-exclamation-circle text-5xl text-yellow-500 mb-2"></i>
          <h1 className="text-2xl font-bold text-gray-800">
            Enlace Incompleto
          </h1>

          <p className="text-gray-600">
            Parece que estás intentando acceder a la declaración jurada sin un
            código de identificación válido.
          </p>

          <Message
            severity="info"
            text="Por favor, revisá el enlace que te enviamos y asegúrate de copiarlo completo. Debería terminar con un código único."
            className="w-full text-left"
          />

          <p className="text-sm text-gray-500 mt-2">
            Ejemplo: .../declaracion-jurada/<strong>codigo-123</strong>
          </p>
        </div>
      </Card>
    </div>
  );
}
