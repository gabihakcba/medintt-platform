import { useState, useRef } from "react";
import { VirtualScroller } from "primereact/virtualscroller";
import { Card } from "primereact/card";
import { Chip } from "primereact/chip";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { EmpresaEmail, ArtEmail, PacienteEmail } from "@/queries/emails";
import { useSendMailing } from "@/hooks/useMailing";

interface ConfirmacionStepProps {
  subject: string;
  message: string;
  attachmentName: string;
  attachmentFile: File | null;
  selectedEmpresas: EmpresaEmail[];
  selectedArt: ArtEmail[];
  selectedPacientes: PacienteEmail[];
  customEmails: string[];
}

export const ConfirmacionStep = ({
  subject,
  message,
  attachmentName,
  attachmentFile,
  selectedEmpresas,
  selectedArt,
  selectedPacientes,
  customEmails,
}: ConfirmacionStepProps) => {
  const toast = useRef<Toast>(null);
  const [isSending, setIsSending] = useState(false);
  const { mutateAsync: sendMailing } = useSendMailing();

  // Combine all emails into a single list
  const allEmails = [
    ...selectedEmpresas.flatMap((e) => e.emails),
    ...selectedArt.flatMap((e) => e.emails),
    ...selectedPacientes.flatMap((e) => e.emails),
    ...customEmails,
  ];

  // Remove duplicates if any
  const uniqueEmails = Array.from(new Set(allEmails));

  const handleSendEmail = async () => {
    try {
      setIsSending(true);

      // Prepare attachments array
      let attachments: Array<{
        filename: string;
        content: string;
        contentType: string;
      }> = [];

      if (attachmentFile && attachmentName) {
        // Convert File to Base64
        const reader = new FileReader();
        const base64Content = await new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            // Remove data URL prefix to get just the base64 string
            const base64 = result.split(",")[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(attachmentFile);
        });

        attachments.push({
          filename: attachmentName,
          content: base64Content,
          contentType: "application/pdf",
        });
      }

      // Prepare the payload
      const payload = {
        emails: uniqueEmails,
        options: {
          subject,
          body: message,
          attachments: attachments.length > 0 ? attachments : undefined,
        },
      };

      await sendMailing(payload);

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: `Email enviado correctamente a ${uniqueEmails.length} destinatarios`,
        life: 5000,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al enviar el email. Por favor intente nuevamente.",
        life: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };

  const itemTemplate = (email: string) => {
    return (
      <div className="flex align-items-center p-2" style={{ height: "40px" }}>
        <span className="text-sm">{email}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <Toast ref={toast} />
      <h2 className="text-xl font-bold">Confirmación de Envío</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Preview */}
        <Card title="Vista Previa del Correo" className="shadow-sm">
          <div className="flex flex-col gap-3">
            <div>
              <span className="font-bold block mb-1">Asunto:</span>
              <div className="p-2 bg-gray-50 rounded border-gray-200 border">
                {subject}
              </div>
            </div>

            <div>
              <span className="font-bold block mb-1">Mensaje:</span>
              <div className="p-3 bg-gray-50 rounded border-gray-200 border whitespace-pre-wrap min-h-[100px]">
                {message}
              </div>
            </div>

            {attachmentName && (
              <div>
                <span className="font-bold block mb-1">Adjunto:</span>
                <Chip
                  label={attachmentName}
                  icon="pi pi-file-pdf"
                  className="bg-blue-100 text-blue-800"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Recipients List */}
        <Card
          title={`Destinatarios (${uniqueEmails.length})`}
          className="shadow-sm"
        >
          <div className="border border-gray-200 rounded">
            {uniqueEmails.length > 0 ? (
              <VirtualScroller
                items={uniqueEmails}
                itemSize={40}
                itemTemplate={itemTemplate}
                className="h-[300px] w-full"
                showLoader
                loading={false}
              />
            ) : (
              <div className="p-4 text-center text-gray-500">
                No hay destinatarios seleccionados.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Send Button - Bottom Right */}
      <div className="flex justify-content-end">
        <Button
          label="Enviar Emails"
          icon="pi pi-send"
          severity="success"
          onClick={handleSendEmail}
          loading={isSending}
          disabled={uniqueEmails.length === 0}
        />
      </div>
    </div>
  );
};
