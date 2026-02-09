import { api } from "../lib/axios";

export interface Interlocutor {
  id: string;
  name: string | null;
  lastName: string | null;
  email: string | null;
  organization: {
    id: string;
    name: string | null;
    code: string | null;
    cuit: string | null;
  } | null;
}

export const fetchInterlocutorSelf = async (): Promise<Interlocutor | null> => {
  const { data } = await api.get<Interlocutor>(
    "/medicina-laboral/interlocutor/self",
  );
  return data;
};
