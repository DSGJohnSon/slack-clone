import { useCreateMessage } from "@/features/messages/api/useCreateMessage";
import { useChannelId } from "@/hooks/useChannelId";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import dynamic from "next/dynamic";
import Quill from "quill";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function ChatInput({ placeholder }: { placeholder: string }) {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const { mutate: createMessage } = useCreateMessage();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      await createMessage(
        {
          workspaceId,
          channelId,
          body,
        },
        { throwError: true }
      );
      //Vide l'éditor après l'envoi du message
      setEditorKey((prevKey) => prevKey + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
}
