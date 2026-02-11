import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMember,
  deleteMember,
  getMembersByOrg,
  CreateMemberData,
} from "@/queries/members";

export const useMembers = () => {
  const queryClient = useQueryClient();

  const membersQuery = useQuery({
    queryKey: ["members-by-org"],
    queryFn: getMembersByOrg,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateMemberData) => createMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members-by-org"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members-by-org"] });
    },
  });

  return {
    organizations: membersQuery.data,
    isLoading: membersQuery.isLoading,
    isError: membersQuery.isError,
    createMember: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteMember: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
