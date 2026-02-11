import { useQuery } from "@tanstack/react-query";
import { fetchInterlocutorSelf } from "../queries/interlocutor";

export const useInterlocutor = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["interlocutor", "self"],
    queryFn: fetchInterlocutorSelf,
  });

  return {
    interlocutor: data,
    isLoading,
    isError,
    error,
  };
};
