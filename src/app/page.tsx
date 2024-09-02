"use client";

import UserButton from "@/features/auth/components/userButton";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/useCreateWorkspaceModal";
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [open, setOpen] = useCreateWorkspaceModal();

  const { data, isLoading } = useGetWorkspaces();

  const router = useRouter();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [workspaceId, isLoading, open, setOpen, router]);

  return (
    <div>
      <UserButton />
    </div>
  );
}
