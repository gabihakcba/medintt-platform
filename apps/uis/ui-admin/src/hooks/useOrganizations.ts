import {
  useMutation,
  useQuery,
  useQueryClient,
  MutationFunction,
} from "@tanstack/react-query";
import { Organization } from "@medintt/types-auth";
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from "@/queries/organizations";

export const useOrganizations = () => {
  const queryClient = useQueryClient();

  const {
    data: organizations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });

  const createMutation = useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });

  return {
    organizations,
    isLoading,
    isError,
    createOrganization: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateOrganization: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteOrganization: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
