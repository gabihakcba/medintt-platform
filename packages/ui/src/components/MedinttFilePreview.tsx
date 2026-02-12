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
        <iframe
          src={url}
          width="100%"
          height="100%"
          style={{ border: "none", height: "100%", display: "block" }}
          title={title}
        />
      )}
    </Dialog>
  );
};
