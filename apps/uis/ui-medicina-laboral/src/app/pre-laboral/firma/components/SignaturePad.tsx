"use client";

import { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "primereact/button";

interface SignaturePadProps {
  onSave: (signatureData: string) => void;
}

export const SignaturePad = ({ onSave }: SignaturePadProps) => {
  const sigPad = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Resize canvas on window resize to be responsive
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const clear = () => {
    sigPad.current?.clear();
    setIsEmpty(true);
  };

  const save = () => {
    if (sigPad.current && !sigPad.current.isEmpty()) {
      onSave(sigPad.current.getCanvas().toDataURL("image/png"));
    }
  };

  const handleEnd = () => {
    if (sigPad.current) {
      setIsEmpty(sigPad.current.isEmpty());
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div
        ref={containerRef}
        className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex justify-center items-center overflow-hidden"
        style={{ height: "300px" }} // Fixed height for area check
      >
        {containerWidth > 0 && (
          <SignatureCanvas
            ref={sigPad}
            penColor="black"
            onEnd={handleEnd}
            canvasProps={{
              width: containerWidth,
              height: 300,
              className: "signature-canvas",
            }}
            backgroundColor="rgba(255,255,255,0)"
          />
        )}
      </div>

      <div className="flex justify-between gap-4">
        <Button
          label="Borrar"
          icon="pi pi-refresh"
          className="p-button-outlined p-button-secondary w-full"
          onClick={clear}
          disabled={isEmpty}
        />
        <Button
          label="Ver Firma"
          icon="pi pi-eye"
          className="p-button-primary w-full"
          onClick={save}
          disabled={isEmpty}
        />
      </div>
    </div>
  );
};
