
import type { WorkspaceForm } from "@/components/workspace/create-workspace";
import { fetchData, postData } from "@/lib/fetch-utils.js";
import { useMutation, useQuery } from "@tanstack/react-query"

export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: async (data:  WorkspaceForm) => postData("/workspaces", data),
  });
};

export const useGetWorkspacesQuery = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => fetchData("/workspaces"),
  });
};


 
export const useGetWorkspaceQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}/projects`)
  })
};

export const useGetWorkspaceStatsQuery = (workspaceId?: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "stats"],
    enabled: !!workspaceId, // only fetch if workspaceId exists
    queryFn: async () => fetchData(`/workspaces/${workspaceId}/stats`),
  });
};

