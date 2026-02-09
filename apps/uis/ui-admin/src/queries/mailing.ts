import { api } from "@/lib/axios";

export interface BulkMailOptions {
  subject: string;
  body: string;
  attachments?: Array<{
    filename: string;
    content: string; // Base64 encoded
    contentType: string;
  }>;
}

export interface SendMailingDto {
  emails: string[];
  options: BulkMailOptions;
}

export const sendMailing = async (data: SendMailingDto): Promise<any> => {
  const response = await api.post("/mailing/send-email", data);
  return response.data;
};
