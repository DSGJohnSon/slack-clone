import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNewJoincode } from "@/features/workspaces/api/useNewJoincode";
import useConfirm from "@/hooks/useConfirm";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { Copy, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export default function InviteModal({
  open,
  setOpen,
  name,
  joinCode,
}: InviteModalProps) {
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will deactivate the current invite code and generate a new one."
  );

  const { mutate, isPending } = useNewJoincode();

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    navigator.clipboard.writeText(inviteLink).then(() => {
      toast.success("Link copied to clipboard");
    });
  };

  const handleNewcode = async () => {
    const ok = await confirm();

    if (!ok) {
      return;
    }

    mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success("New code generated");
        },
        onError: (error) => {
          toast.error("Failed to regenerate invite code");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>
              Use the code below to add people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase bg-slate-50 border border-slate-300 rounded-md p-4 text-slate-600">
              {joinCode}
            </p>
            <Button variant={"ghost"} size={"sm"} onClick={handleCopy}>
              Copy link
              <Copy className="ml-2 size-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              onClick={handleNewcode}
              disabled={isPending}
              variant={"outline"}>
              New code
              <RefreshCcw className="size-4 ml-2" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
