import type { Project } from "@/types";


interface ProjectCardProps {
    project: Project;
    progrss: number;
    workspaceId: string;
}

export const ProjectCard = ({
    project,
    progrss,
    workspaceId,
}: ProjectCardProps) => {
    return (
        <div>
            <div></div>
        </div>
    )
}