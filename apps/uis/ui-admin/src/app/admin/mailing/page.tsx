"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { checkPermissions } from "@/services/permissions";
import { MedinttGuard } from "@medintt/ui";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { DestinatariosStep } from "./components/steps/DestinatariosStep";
import { ContenidoStep } from "./components/steps/ContenidoStep";
import { ConfirmacionStep } from "./components/steps/ConfirmacionStep";
import { Button } from "primereact/button";
import { EmpresaEmail, ArtEmail, PacienteEmail } from "@/queries/emails";
import { Toast } from "primereact/toast";

export default function MailingPage() {
  const { user } = useAuth();
  const stepperRef = useRef<any>(null);
  const toast = useRef<Toast>(null);

  // Stats for selection
  const [selectedEmpresas, setSelectedEmpresas] = useState<EmpresaEmail[]>([]);
  const [selectedArt, setSelectedArt] = useState<ArtEmail[]>([]);
  const [selectedPacientes, setSelectedPacientes] = useState<PacienteEmail[]>(
    [],
  );
  const [customEmails, setCustomEmails] = useState<string[]>([]);

  // Content State
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [attachmentName, setAttachmentName] = useState<string>("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const handleNextStep1 = () => {
    const totalRecipients =
      selectedEmpresas.length +
      selectedArt.length +
      selectedPacientes.length +
      customEmails.length;

    if (totalRecipients === 0) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Debe seleccionar al menos un destinatario",
      });
      return;
    }
    stepperRef.current.nextCallback();
  };

  const handleNextStep2 = () => {
    if (!subject.trim() || !message.trim()) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Debe completar el asunto y el mensaje",
      });
      return;
    }
    stepperRef.current.nextCallback();
  };

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
      <div className="p-4 space-y-4">
        <Toast ref={toast} />
        <h1 className="text-2xl font-bold mb-4">Sección Mailing</h1>

        <div className="card">
          <Stepper ref={stepperRef} style={{ flexBasis: "50rem" }}>
            <StepperPanel header="Destinatarios">
              <div className="flex flex-column h-12rem">
                <div className="flex-auto flex justify-content-center align-items-center font-medium">
                  <DestinatariosStep
                    selectedEmpresas={selectedEmpresas}
                    setSelectedEmpresas={setSelectedEmpresas}
                    selectedArt={selectedArt}
                    setSelectedArt={setSelectedArt}
                    selectedPacientes={selectedPacientes}
                    setSelectedPacientes={setSelectedPacientes}
                    customEmails={customEmails}
                    setCustomEmails={setCustomEmails}
                  />
                </div>
              </div>
              <div className="flex pt-4 justify-content-end">
                <Button
                  label="Siguiente"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  onClick={handleNextStep1}
                />
              </div>
            </StepperPanel>
            <StepperPanel header="Contenido">
              <div className="flex flex-column h-12rem">
                <div className="flex-auto flex justify-content-center align-items-center font-medium">
                  <ContenidoStep
                    subject={subject}
                    setSubject={setSubject}
                    message={message}
                    setMessage={setMessage}
                    attachmentName={attachmentName}
                    setAttachmentName={setAttachmentName}
                    attachmentFile={attachmentFile}
                    setAttachmentFile={setAttachmentFile}
                  />
                </div>
              </div>
              <div className="flex pt-4 justify-content-between">
                <Button
                  label="Atrás"
                  severity="secondary"
                  icon="pi pi-arrow-left"
                  onClick={() => stepperRef.current.prevCallback()}
                />
                <Button
                  label="Siguiente"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  onClick={handleNextStep2}
                />
              </div>
            </StepperPanel>
            <StepperPanel header="Confirmación">
              <div className="flex flex-column h-12rem">
                <div className="flex-auto flex justify-content-center align-items-center font-medium">
                  <ConfirmacionStep
                    subject={subject}
                    message={message}
                    attachmentName={attachmentName}
                    attachmentFile={attachmentFile}
                    selectedEmpresas={selectedEmpresas}
                    selectedArt={selectedArt}
                    selectedPacientes={selectedPacientes}
                    customEmails={customEmails}
                  />
                </div>
              </div>
              <div className="flex pt-4 justify-content-start">
                <Button
                  label="Atrás"
                  severity="secondary"
                  icon="pi pi-arrow-left"
                  onClick={() => stepperRef.current.prevCallback()}
                />
              </div>
            </StepperPanel>
          </Stepper>
        </div>
      </div>
    </MedinttGuard>
  );
}
