import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@medintt/types-auth";
import {
  createUser,
  getUsers,
  updateUser,
  CreateUserData,
  createInterlocutor,
  CreateInterlocutorData,
  deleteUser,
} from "@/queries/users";

export const useUsers = () => {
  const queryClient = useQueryClient();

  const usersQuery = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateUserData) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const createInterlocutorMutation = useMutation({
    mutationFn: (data: CreateInterlocutorData) => createInterlocutor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateUserData> }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    users: usersQuery.data,
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    createUser: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createInterlocutor: createInterlocutorMutation.mutateAsync,
    isCreatingInterlocutor: createInterlocutorMutation.isPending,
    updateUser: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteUser: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
