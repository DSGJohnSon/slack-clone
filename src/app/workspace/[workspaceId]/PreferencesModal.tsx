"use client";

import { useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { useUpdateWorkspace } from "@/features/workspaces/api/useUpdateWorkspace";
import { useRemoveWorkspace } from "@/features/workspaces/api/useRemoveWorkspace";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { toast } from "sonner";
import { on } from "events";
import { useRouter } from "next/navigation";
import useConfirm from "@/hooks/useConfirm";

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

export default function PreferencesModal({
  open,
  setOpen,
  initialValue,
}: PreferencesModalProps) {
  const router = useRouter();

  const workspaceId = useWorkspaceId();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure ? > Delete workspace",
    "This action cannot be undone."
  );

  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace();
  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
    useRemoveWorkspace();

  const handleRemove = async () => {

    const ok = await confirm();

    if (!ok) {
      return;
    }

    removeWorkspace(
      {
        id: workspaceId,
      },
      {
        onSuccess: () => {
          toast.success("Workspace removed successfully");
          router.replace("/");
        },
        onError: (error) => {
          toast.error("Failed to remove workspace");
        },
      }
    );
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateWorkspace(
      {
        id: workspaceId,
        name: value,
      },
      {
        onSuccess: () => {
          toast.success("Workspace updated successfully");
          setEditOpen(false);
        },
        onError: (error) => {
          toast.error("Failed to update workspace");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>{value}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Workspace name</p>
                    <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename this workspace</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleEdit}>
                    <Input
                      value={value}
                      disabled={isUpdatingWorkspace}
                      onChange={(e) => setValue(e.target.value)}
                      required
                      autoFocus
                      minLength={3}
                      maxLength={80}
                      placeholder="Workspace name e.G. 'Work', 'Personal', 'Home'"
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          variant={"outline"}
                          disabled={isUpdatingWorkspace}
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button disabled={isUpdatingWorkspace}>Save</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <p className="text-sm">{value}</p>
            </div>
            <button
              disabled={isRemovingWorkspace}
              onClick={handleRemove}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
            >
              <Trash className="size-4" />
              <p className="text-sm font-semibold">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
