"use client";

import { Card } from "primereact/card";
import {
  PacienteResponse,
  EmpresaResponse,
} from "@/queries/declaracion-jurada";
import { ReactElement } from "react";
import { formatDate } from "@medintt/utils";

interface HeaderDeclaracionProps {
  paciente: PacienteResponse;
  empresa: EmpresaResponse;
}

export function HeaderDeclaracion({
  paciente,
  empresa,
}: HeaderDeclaracionProps): ReactElement {
  return (
    <Card className="shadow-sm border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <i className="pi pi-info-circle mr-2 text-blue-600"></i>
        Información General
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Datos del Paciente
          </h3>
          <div className="grid grid-cols-2 gap-y-2">
            <span className="text-gray-600 font-medium">Nombre:</span>
            <span className="text-gray-900">
              {paciente.Nombre} {paciente.Apellido}
            </span>
            <span className="text-gray-600 font-medium">Documento:</span>
            <span className="text-gray-900">{paciente.NroDocumento}</span>
            <span className="text-gray-600 font-medium">Fecha Nac.:</span>
            <span className="text-gray-900">
              {paciente.FechaNacimiento
                ? formatDate(paciente.FechaNacimiento, "DD/MM/YYYY")
                : "-"}
            </span>
            <span className="text-gray-600 font-medium">Género:</span>
            <span className="text-gray-900">{paciente.Genero}</span>
            <span className="text-gray-600 font-medium">Dirección:</span>
            <span className="text-gray-900">{paciente.Direccion}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Datos de la Empresa
          </h3>
          <div className="grid grid-cols-2 gap-y-2">
            <span className="text-gray-600 font-medium">Empresa:</span>
            <span className="text-gray-900">{empresa.Nombre}</span>
            <span className="text-gray-600 font-medium">Dirección:</span>
            <span className="text-gray-900">{empresa.Direccion}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
