import { useRef } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

interface ContenidoStepProps {
  subject: string;
  setSubject: (value: string) => void;
  message: string;
  setMessage: (value: string) => void;
  attachmentName: string;
  setAttachmentName: (value: string) => void;
  attachmentFile: File | null;
  setAttachmentFile: (file: File | null) => void;
}

export const ContenidoStep = ({
  subject,
  setSubject,
  message,
  setMessage,
  attachmentName,
  setAttachmentName,
  attachmentFile,
  setAttachmentFile,
}: ContenidoStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useRef<Toast>(null);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Solo se permiten archivos PDF",
        });
        // Clear the input so the user can try again
        e.target.value = "";
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "El archivo no debe superar los 5MB",
        });
        e.target.value = "";
        return;
      }
      setAttachmentFile(file);
    }
  };

  const chooseFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Toast ref={toast} />
      <h2 className="text-xl font-bold">Redactar Contenido</h2>

      <div className="flex flex-col gap-2">
        <label htmlFor="subject" className="font-bold">
          Asunto
        </label>
        <InputText
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Ej. Promoción de chequeos preventivos"
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="body" className="font-bold">
          Mensaje
        </label>
        <InputTextarea
          id="body"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe el contenido principal del correo..."
          rows={5}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="attachmentName" className="font-bold">
          Nombre del archivo adjunto
        </label>
        <InputText
          id="attachmentName"
          value={attachmentName}
          onChange={(e) => setAttachmentName(e.target.value)}
          placeholder="Ej. brochure-medintt.pdf"
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold">Archivo PDF</label>
        <div className="flex gap-2">
          <InputText
            value={
              attachmentFile ? attachmentFile.name : "Selecciona un archivo PDF"
            }
            readOnly
            className="w-full surface-100"
          />
          <input
            type="file"
            ref={fileInputRef}
            accept="application/pdf"
            onChange={onFileSelect}
            className="hidden"
            style={{ display: "none" }}
          />
          <Button
            label="Seleccionar PDF"
            icon="pi pi-plus"
            onClick={chooseFile}
            className="w-auto whitespace-nowrap"
          />
        </div>
        <small className="text-gray-500">
          Acepta solo archivos PDF de hasta 5 MB.
        </small>
      </div>
    </div>
  );
};
