// No quitar, es necesario para que funcione el useState
"use client";

import { MedinttButton, MedinttForm, MedinttToast } from "@medintt/ui";
import Image from "next/image";
import { useRef, useState, ReactElement } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Card } from "primereact/card";
import { useLoginHook } from "@/hooks/login";
import { use2FA } from "@/hooks/use2FA";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import {
  LoginResponseDto,
  TYPE_LOGIN,
} from "@medintt/types-auth/dist/auth/login.type";
import { Toast } from "primereact/toast";

import { sendParentMessage } from "@/utils/parent-message";

export default function LoginPage(): ReactElement {
  const { control, handleSubmit, reset } = useForm();
  const { loginHook, loginPending, isTwoFactorRequired } = useLoginHook();
  const {
    generateMutate,
    generatePending,
    generateData,
    turnOnMutate,
    turnOnPending,
  } = use2FA();
  const { forgotPasswordMutate, forgotPasswordPending } = useForgotPassword();

  const [credentials, setCredentials] = useState<FieldValues | null>(null);
  const [isActivationMode, setIsActivationMode] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [loginResponse, setLoginResponse] = useState<LoginResponseDto | null>(
    null,
  ); // Store full response
  const [twoFaCode, setTwoFaCode] = useState("");
  const toast = useRef<Toast>(null);

  const handleLogin = (data: FieldValues) => {
    if (isForgotMode) {
      forgotPasswordMutate(
        { email: data.email },
        {
          onSuccess: () => {
            toast.current?.show({
              severity: "success",
              summary: "Éxito",
              detail: "Se ha enviado un correo para restablecer tu contraseña",
              life: 3000,
            });
            toggleForgotMode();
          },
          onError: () => {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail:
                "No se pudo enviar el correo. Verifica que el email sea correcto.",
              life: 3000,
            });
          },
        },
      );
      return;
    }

    if (isActivationMode) {
      // Flow de activacion: Primero logueamos para obtener token
      loginHook(data, {
        onSuccess: (response: LoginResponseDto) => {
          // Guardamos la respuesta completa para enviarla al padre despues
          setLoginResponse(response);
          // Ya no necesitamos el token para generar 2FA, usamos cookies
          generateMutate(undefined, {
            onSuccess: () => {
              setShowQrModal(true);
            },
            onError: () => {
              toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "No se pudo generar el código QR",
                life: 3000,
              });
            },
          });
        },
        onError: () => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Credenciales inválidas",
            life: 3000,
          });
        },
      });
      return;
    }

    if (isTwoFactorRequired && credentials) {
      loginHook(
        { ...credentials, ...data },
        {
          onSuccess: (response: LoginResponseDto) => {
            sendParentMessage(TYPE_LOGIN.SUCCESS, { user: response.user });
          },
          onError: () => {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: "Código de verificación inválido",
              life: 3000,
            });
          },
        },
      );
    } else {
      setCredentials(data);
      loginHook(data, {
        onSuccess: (response: LoginResponseDto) => {
          sendParentMessage(TYPE_LOGIN.SUCCESS, { user: response.user });
        },
        onError: (error) => {
          // Si NO es 2FA required (ya que ese caso lo maneja el hook internamente sin llamar a onError prop si no lo pasamos explicitamente o si?)
          // El hook loginHook maneja onError interno para setear isTwoFactorRequired.
          // Pero si falla por password incorrecto, mostramos toast.
          // @ts-expect-error type
          if (error.response?.data?.code !== "2FA_REQUIRED") {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: "Credenciales inválidas",
              life: 3000,
            });
          }
        },
      });
    }
  };

  const handleActivate2FA = () => {
    if (twoFaCode) {
      turnOnMutate(
        { code: twoFaCode },
        {
          onSuccess: () => {
            toast.current?.show({
              severity: "success",
              summary: "Éxito",
              detail: "Autenticación de dos factores activada",
              life: 3000,
            });
            setShowQrModal(false);

            // Retardo para que el usuario vea el toast antes de redirigir (opcional)
            setTimeout(() => {
              sendParentMessage(TYPE_LOGIN.SUCCESS, {
                user: loginResponse?.user || undefined, // Send the full original response
              });
            }, 1000);
          },
          onError: () => {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: "Código de verificación inválido",
              life: 3000,
            });
          },
        },
      );
    }
  };

  const toggleActivationMode = () => {
    setIsActivationMode(!isActivationMode);
    setTwoFaCode("");
    setShowQrModal(false);
    setLoginResponse(null);
    setCredentials(null);
    reset(); // Reset form
  };

  const toggleForgotMode = () => {
    setIsForgotMode(!isForgotMode);
    setIsActivationMode(false);
    setCredentials(null);
    setLoginResponse(null);
    reset();
  };

  const getSubmitLabel = () => {
    if (isForgotMode) return "Enviar Email";
    if (isTwoFactorRequired) return "Verificar";
    if (isActivationMode) return "Generar QR";
    return "Iniciar Sesión";
  };

  const getSubmitIcon = () => {
    if (isForgotMode) return "pi pi-envelope";
    return undefined; // Button default or no icon
  };

  const getLoadingState = () => {
    if (isForgotMode) return forgotPasswordPending;
    if (isActivationMode) return loginPending || generatePending;
    return loginPending;
  };

  return (
    <Card className="h-screen flex justify-center items-center">
      <MedinttToast ref={toast} />
      {showQrModal ? (
        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4">Escanear Código QR</h2>
          {generateData?.qrCodeUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={generateData.qrCodeUrl}
              alt="QR Code"
              width={200}
              height={200}
              style={{ objectFit: "contain" }}
            />
          )}
          <p className="text-center text-sm">
            Escanea el código con tu aplicación de autenticación (Google
            Authenticator, Authy, etc).
          </p>
          {generateData?.secret && (
            <div className="text-center">
              <p className="text-xs font-bold">
                O ingresa este código manualmente:
              </p>
              <p className="font-mono text-lg select-all p-2 rounded mt-1">
                {generateData.secret}
              </p>
            </div>
          )}

          <div className="w-full mt-4">
            <label className="block text-sm font-medium mb-1">
              Código de Verificación
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="123456"
              value={twoFaCode}
              onChange={(e) => setTwoFaCode(e.target.value)}
            />
          </div>

          <div className="flex w-full gap-2 mt-2">
            <MedinttButton
              label="Cancelar"
              severity="secondary"
              className="w-full"
              onClick={() => setShowQrModal(false)}
            />
            <MedinttButton
              label="Activar"
              className="w-full"
              onClick={handleActivate2FA}
              loading={turnOnPending}
              disabled={!twoFaCode || twoFaCode.length < 6}
            />
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          <Image
            src="/logo_large.png"
            alt="Medintt Logo"
            width={250}
            height={80}
            className="mb-6 object-contain"
            priority
          />
          <MedinttForm
            control={control}
            className="w-full max-w-sm"
            onSubmit={handleLogin}
            handleSubmit={handleSubmit}
            footer={
              <div className="flex flex-col w-full gap-2 mt-2">
                <div className="flex shrink justify-center items-center flex-col-reverse sm:flex-row w-full gap-2">
                  {!isTwoFactorRequired &&
                    !isActivationMode &&
                    !isForgotMode && (
                      <MedinttButton
                        label="Olvide mi contraseña"
                        type="button"
                        onClick={toggleForgotMode}
                        severity="secondary"
                        text
                        link
                      />
                    )}

                  {isForgotMode && (
                    <MedinttButton
                      label="Volver al Login"
                      type="button"
                      onClick={toggleForgotMode}
                      severity="secondary"
                      text
                      link
                    />
                  )}

                  <MedinttButton
                    label={getSubmitLabel()}
                    type="submit"
                    icon={getSubmitIcon()}
                    loading={getLoadingState()}
                  />
                </div>

                {!isTwoFactorRequired && !isForgotMode && (
                  <div className="flex justify-center w-full">
                    <MedinttButton
                      label={
                        isActivationMode
                          ? "Volver al Login"
                          : "Activar 2FA (Generar QR)"
                      }
                      type="button"
                      onClick={toggleActivationMode}
                      severity="secondary"
                      text
                      link
                    />
                  </div>
                )}
              </div>
            }
            sections={[
              {
                group: isForgotMode
                  ? "Recuperar Contraseña"
                  : isActivationMode
                    ? "Activar autenticación de dos factores"
                    : "Iniciar Sesión",
                fields: [
                  ...(isTwoFactorRequired
                    ? [
                        {
                          type: "text" as const,
                          props: {
                            name: "twoFactorCode",
                            label: "Código de doble factor",
                            autoFocus: true,
                            autoComplete: "off" as const,
                            placeholder: "123456",
                            rules: {
                              required: {
                                value: true,
                                message: "Campo obligatorio",
                              },
                              minLength: { value: 6, message: "6 caracteres" },
                              pattern: {
                                value: /^[0-9]+$/,
                                message: "Solo números",
                              },
                            },
                          },
                          colSpan: 12,
                        },
                      ]
                    : isForgotMode
                      ? [
                          {
                            type: "text" as const,
                            props: {
                              name: "email",
                              label: "Correo Electrónico",
                              autoComplete: "on" as const,
                              placeholder: "ejemplo@gmail.com",
                              rules: {
                                required: {
                                  value: true,
                                  message: "Campo obligatorio",
                                },
                                pattern: {
                                  value:
                                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: "Email inválido",
                                },
                              },
                            },
                            colSpan: 12,
                          },
                        ]
                      : [
                          {
                            type: "text" as const,
                            props: {
                              name: "email",
                              label: "Email o Usuario",
                              autoComplete: "off" as const,
                              placeholder: "ejemplo@gmail.com | usuario",
                              rules: {
                                required: {
                                  value: true,
                                  message: "Campo obligatorio",
                                },
                              },
                            },
                            colSpan: 12,
                          },
                          {
                            type: "password" as const,
                            props: {
                              name: "password",
                              label: "Contraseña",
                              autoComplete: "off" as const,
                              placeholder: "******",
                              rules: {
                                required: {
                                  value: true,
                                  message: "Campo obligatorio",
                                },
                                minLength: {
                                  value: 6,
                                  message: "6 caracteres",
                                },
                              },
                            },
                            colSpan: 12,
                          },
                        ]),
                ],
              },
            ]}
          />
        </div>
      )}
    </Card>
  );
}
