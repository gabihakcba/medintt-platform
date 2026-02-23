import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMember,
  deleteMember,
  getMembersByOrg,
  getMembersByUser,
  CreateMemberData,
} from "@/queries/members";

export const useMembers = () => {
  const queryClient = useQueryClient();

  const membersQuery = useQuery({
    queryKey: ["members-by-org"],
    queryFn: getMembersByOrg,
  });

  const membersByUserQuery = useQuery({
    queryKey: ["members-by-user"],
    queryFn: getMembersByUser,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateMemberData) => createMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members-by-org"] });
      queryClient.invalidateQueries({ queryKey: ["members-by-user"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members-by-org"] });
      queryClient.invalidateQueries({ queryKey: ["members-by-user"] });
    },
  });

  return {
    organizations: membersQuery.data,
    usersWithMemberships: membersByUserQuery.data,
    isLoading: membersQuery.isLoading || membersByUserQuery.isLoading,
    isError: membersQuery.isError || membersByUserQuery.isError,
    createMember: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteMember: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
