"use client";

import React from "react";
import Toolbar from "./Toolbar";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

export default function WorkspaceIdLayout({
  children,
}: WorkspaceIdLayoutProps) {
  return (
    <div className="h-full">
      <Toolbar />
      {children}
    </div>
  );
}
