import { useMutation } from "@tanstack/react-query";
import { sendMailing, SendMailingDto } from "@/queries/mailing";

export const useSendMailing = () => {
  return useMutation({
    mutationFn: (data: SendMailingDto) => sendMailing(data),
  });
};
