import { Dialog } from "primereact/dialog";
import { ReactElement } from "react";

interface AuthModalProps {
  visible: boolean;
  onHide: () => void;
}

export default function AuthModal({ visible, onHide }: AuthModalProps) {
  const authUrl = `${process.env.NEXT_PUBLIC_AUTH_FRONT}${process.env.NEXT_PUBLIC_AUTH_LOGIN}`;

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Iniciar Sesión"
      style={{ width: "50vw" }}
      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      modal
      contentClassName="p-0"
    >
      <div style={{ height: "600px", width: "100%" }}>
        <iframe
          src={authUrl}
          style={{ width: "100%", height: "100%", border: "none" }}
          title="Login"
        />
      </div>
    </Dialog>
  );
}
