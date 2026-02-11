import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPermissions,
  createPermission,
  updatePermission,
} from "@/queries/permissions";

export const usePermissions = () => {
  const queryClient = useQueryClient();

  const {
    data: permissions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  });

  const createMutation = useMutation({
    mutationFn: createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });

  return {
    permissions,
    isLoading,
    isError,
    createPermission: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updatePermission: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};
