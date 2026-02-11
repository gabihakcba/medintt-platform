import { Chips } from "primereact/chips";

interface ParticularesTabProps {
  customEmails: string[];
  setCustomEmails: (emails: string[]) => void;
}

export const ParticularesTab = ({
  customEmails,
  setCustomEmails,
}: ParticularesTabProps) => {
  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="customEmails" className="font-bold">
          Emails Particulares
        </label>
        <Chips
          id="customEmails"
          value={customEmails}
          onChange={(e) => setCustomEmails(e.value || [])}
          placeholder="Ingrese emails y presione Enter o Espacio"
          separator=","
          className="w-full"
        />
        <small className="text-gray-500">
          Presione Enter o Espacio para agregar cada email.
        </small>
      </div>

      {customEmails.length > 0 && (
        <div className="mt-2">
          <span className="font-bold">
            Total: {customEmails.length} email(s)
          </span>
        </div>
      )}
    </div>
  );
};
