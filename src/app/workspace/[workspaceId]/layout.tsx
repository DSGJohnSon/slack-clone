"use client";

import React from "react";
import Toolbar from "./(components)/Toolbar";
import Sidebar from "./(components)/Sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import WorkspaceSidebar from "./(components)/WorkspaceSidebar";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

export default function WorkspaceIdLayout({
  children,
}: WorkspaceIdLayoutProps) {
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId={"dev-workspace-layout"}>
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5e2c5f]">
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
