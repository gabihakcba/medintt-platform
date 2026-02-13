"use client";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useRef } from "react";
import { Toast } from "primereact/toast";

interface MedinttFilePreviewProps {
  visible: boolean;
  onHide: () => void;
  url: string | null;
  title?: string;
  extension?: string | null;
}

export const MedinttFilePreview = ({
  visible,
  onHide,
  url,
  title = "Vista Previa de Documento",
  extension,
}: MedinttFilePreviewProps) => {
  const toast = useRef<Toast>(null);

  const isPdf =
    (extension && extension.toLowerCase().includes("pdf")) ||
    (!extension && title?.toLowerCase().endsWith(".pdf")) ||
    (!extension && !title?.includes(".") && true); // Default to PDF only if no extension and no dot in title

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow && url) {
      printWindow.document.write(`
              <html>
                  <head><title>${title}</title></head>
                  <body style="margin:0; display:flex; justify-content:center; align-items:center;">
                      <img src="${url}" style="max-width:100%;" onload="window.print();window.close()" />
                  </body>
              </html>
          `);
      printWindow.document.close();
    }
  };

  return (
    <Dialog
      header={title}
      visible={visible}
      style={{ width: "80vw", height: "90vh" }}
      onHide={onHide}
      maximizable
      modal
      contentStyle={{
        height: "100%",
        padding: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Toast ref={toast} />
      {url && (
        <>
          {isPdf ? (
            <object
              data={url}
              type="application/pdf"
              width="100%"
              height="100%"
              style={{ height: "100%", display: "block" }}
              title={title}
            >
              <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-600">
                <i className="pi pi-file-pdf text-4xl mb-4 text-gray-400"></i>
                <p className="text-lg font-medium mb-4">{title}</p>
                <Button
                  label="Abrir"
                  icon="pi pi-external-link"
                  onClick={() => window.open(url, "_blank")}
                />
              </div>
            </object>
          ) : (
            <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
              {/* Toolbar */}
              <div className="flex justify-end gap-2 p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <Button
                  icon="pi pi-print"
                  rounded
                  text
                  severity="secondary"
                  tooltip="Imprimir"
                  onClick={handlePrint}
                />
              </div>
              {/* Image Container */}
              <div className="flex-1 overflow-auto flex items-center justify-center p-4">
                <img
                  src={url}
                  alt={title}
                  className="max-w-full max-h-full object-contain shadow-md"
                />
              </div>
            </div>
          )}
        </>
      )}
    </Dialog>
  );
};
