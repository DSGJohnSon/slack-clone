"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRemoveChannel } from "@/features/channels/api/useRemoveChannel";
import { useUpdateChannel } from "@/features/channels/api/useUpdateChannel";
import { useChannelId } from "@/hooks/useChannelId";
import useConfirm from "@/hooks/useConfirm";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { DialogClose } from "@radix-ui/react-dialog";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";

export default function Header({ title }: { title: string }) {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete this channel?",
    "You are about to delete this channel. This action cannot be undone. Are you sure you want to proceed?"
  );
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);
  const [value, setValue] = useState(title);

  const { mutate: updateChannel, isPending: isUpdatingChannel } =
    useUpdateChannel();
  const { mutate: removeChannel, isPending: isRemovingChannel } =
    useRemoveChannel();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value.replace(/\s+/g, "-").toLowerCase());
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    await removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success("Channel deleted!");
          router.push(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to delete channel!");
        },
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (value === title) {
      setEditOpen(false);
      return;
    }

    await updateChannel(
      { id: channelId, name: value },
      {
        onSuccess: () => {
          toast.success("Channel updated!");
          setEditOpen(false);
        },
        onError: (error) => {
          toast.error("Failed to update channel!");
        },
      }
    );
  };

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"ghost"}
            className="text-lg font-semibold px-2 overflow-hidden w-auto"
            size={"sm"}>
            <span className="truncate"># {title}</span>
            <FaChevronDown className="size-2.5 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle># {title}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 flex flex-col items-start">
                  <div className="flex items-center justify-between w-full">
                    <p className="text-sm font-semibold">Channel name</p>
                    <p className="text-sm text-[#1264a3] underline font-semibold">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm"># {title}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this channel</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <Input
                    value={value}
                    disabled={isUpdatingChannel}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="e.g. plan-budget"></Input>
                </form>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant={"outline"} disabled={isUpdatingChannel}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button disabled={isUpdatingChannel}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <button
              onClick={handleDelete}
              disabled={isRemovingChannel}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600">
              <Trash className="size-4" />
              <p className="text-sm font-semibold">Delete channel</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
