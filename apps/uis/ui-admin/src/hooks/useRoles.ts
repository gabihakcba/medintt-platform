import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRoles, createRole, updateRole } from "@/queries/roles";

export const useRoles = () => {
  const queryClient = useQueryClient();

  const {
    data: roles,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const createMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  return {
    roles,
    isLoading,
    isError,
    createRole: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateRole: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};
