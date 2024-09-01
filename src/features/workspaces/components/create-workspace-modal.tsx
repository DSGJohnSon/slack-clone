"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateWorkspaceModal() {
  const [open, setOpen] = useCreateWorkspaceModal();
  const [name, setName] = useState("");

  const router = useRouter();

  const { mutate, isPending } = useCreateWorkspace();

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate({
        name: "Workspace 1",
    }, {
        onSuccess(id){
          toast.success("Workspace created successfully");
          router.push(`/workspace/${id}`);
          handleClose();
        }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            placeholder="Workspace name e.G. 'Work', 'Personnal', 'Home'"
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>
                Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
