import ProjectViewAdmin from "@/app/components/projects/ProjectViewAdmin";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectViewPage({ params }: Props) {
  const { id } = await params;
  return <ProjectViewAdmin projectId={id} />;
}
