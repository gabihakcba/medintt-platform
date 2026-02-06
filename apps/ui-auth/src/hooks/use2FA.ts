import { generate2Fa, turnOn2Fa } from "@/queries/2fa";
import { useMutation } from "@tanstack/react-query";

export function use2FA() {
  const {
    mutate: generateMutate,
    isPending: generatePending,
    isSuccess: generateSuccess,
    data: generateData,
    error: generateError,
  } = useMutation({
    mutationFn: () => generate2Fa(),
  });

  const {
    mutate: turnOnMutate,
    isPending: turnOnPending,
    isSuccess: turnOnSuccess,
    error: turnOnError,
  } = useMutation({
    mutationFn: ({ code }: { code: string }) => turnOn2Fa(code),
  });

  return {
    generateMutate,
    generatePending,
    generateSuccess,
    generateData,
    generateError,
    turnOnMutate,
    turnOnPending,
    turnOnSuccess,
    turnOnError,
  };
}
