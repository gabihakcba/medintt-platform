import { TabView, TabPanel } from "primereact/tabview";
import { EmpresasTab } from "../tabs/EmpresasTab";
import { ArtTab } from "../tabs/ArtTab";
import { PacientesTab } from "../tabs/PacientesTab";
import { ParticularesTab } from "../tabs/ParticularesTab";
import { EmpresaEmail, ArtEmail, PacienteEmail } from "@/queries/emails";

interface DestinatariosStepProps {
  selectedEmpresas: EmpresaEmail[];
  setSelectedEmpresas: (empresas: EmpresaEmail[]) => void;
  selectedArt: ArtEmail[];
  setSelectedArt: (art: ArtEmail[]) => void;
  selectedPacientes: PacienteEmail[];
  setSelectedPacientes: (pacientes: PacienteEmail[]) => void;
  customEmails: string[];
  setCustomEmails: (emails: string[]) => void;
}

export const DestinatariosStep = ({
  selectedEmpresas,
  setSelectedEmpresas,
  selectedArt,
  setSelectedArt,
  selectedPacientes,
  setSelectedPacientes,
  customEmails,
  setCustomEmails,
}: DestinatariosStepProps) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-xl font-bold">Seleccionar Destinatarios</h2>
      <TabView>
        <TabPanel header="Empresas">
          <EmpresasTab
            selectedEmpresas={selectedEmpresas}
            setSelectedEmpresas={setSelectedEmpresas}
          />
        </TabPanel>
        <TabPanel header="ART">
          <ArtTab selectedArt={selectedArt} setSelectedArt={setSelectedArt} />
        </TabPanel>
        <TabPanel header="Pacientes">
          <PacientesTab
            selectedPacientes={selectedPacientes}
            setSelectedPacientes={setSelectedPacientes}
          />
        </TabPanel>
        <TabPanel header="Particulares">
          <ParticularesTab
            customEmails={customEmails}
            setCustomEmails={setCustomEmails}
          />
        </TabPanel>
      </TabView>
    </div>
  );
};
