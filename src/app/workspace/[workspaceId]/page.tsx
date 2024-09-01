interface WorkspaceIdPageProps {
  params: {
    workspaceId: string;
  };
}

export default function WorkspaceIdPage({ params }: WorkspaceIdPageProps) {
  return <div>
    ID: {params.workspaceId}
  </div>;
}
