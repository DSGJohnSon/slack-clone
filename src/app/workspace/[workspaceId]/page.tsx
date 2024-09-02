"use client";

import { useGetWorkspace } from "@/features/workspaces/api/useGetWorkspace";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

export default function WorkspaceIdPage() {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspace({ id: workspaceId });

  return <div>
    ID: {JSON.stringify(data)}
  </div>;
}
