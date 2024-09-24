import dynamic from "next/dynamic";
import Quill from "quill";
import React, { useRef } from "react";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function ChatInput({ placeholder }: { placeholder: string }) {
  const editorRef = useRef<Quill | null>(null);

  return (
    <div className="px-5 w-full">
      <Editor
        placeholder={placeholder}
        onSubmit={() => {}}
        disabled={false}
        innerRef={editorRef}
      />
    </div>
  );
}
