"use client";

import { Dialog } from "primereact/dialog";

interface MedinttFilePreviewProps {
  visible: boolean;
  onHide: () => void;
  url: string | null;
  title?: string;
}

export const MedinttFilePreview = ({
  visible,
  onHide,
  url,
  title = "Vista Previa de Documento",
}: MedinttFilePreviewProps) => {
  return (
    <Dialog
      header={title}
      visible={visible}
      style={{ width: "80vw", height: "90vh" }}
      onHide={onHide}
      maximizable
      modal
      contentStyle={{ height: "100%", padding: 0 }}
    >
      {url && (
        <object
          data={url}
          type="application/pdf"
          width="100%"
          height="100%"
          style={{ height: "100%", display: "block" }}
          title={title}
        >
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-600">
            <i className="pi pi-exclamation-circle text-4xl mb-4 text-red-500"></i>
            <p className="text-lg font-medium">
              No se pudo previsualizar el archivo.
            </p>
            <p className="text-sm mt-2">
              Por favor, utiliza el botón de "Descargar" abajo.
            </p>
          </div>
        </object>
      )}
    </Dialog>
  );
};
