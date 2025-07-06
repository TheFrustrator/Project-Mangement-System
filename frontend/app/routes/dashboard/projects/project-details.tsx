import { BackButton } from "@/components/back-button";
import { Loader } from "@/components/loader";
import { CreateTaskDialog } from "@/components/task/create-task-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseProjectQuery } from "@/hooks/use-project";
import { getProjectProgress } from "@/lib";
import { cn } from "@/lib/utils";
import type { Project, Task, TaskStatus } from "@/types";
import { format } from "date-fns";
import { AlertCircle, Calendar, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

const ProjectDetails = () => {
  const { projectId, workspaceId } = useParams<{
    projectId: string;
    workspaceId: string;
  }>();
  const navigate = useNavigate();

  const [isCreateTask, setIsCreateTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState<TaskStatus | "All">("All");

  const { data, isLoading } = UseProjectQuery(projectId!) as {
    data: {
      tasks: Task[];
      project: Project;
    };
    isLoading: boolean;
  };

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  const { project, tasks } = data;
  const projectProgress = getProjectProgress(tasks);

  const handleTaskClick = (taskId: string) => {
    navigate(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <BackButton />
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">{project.title}</h1>
          </div>
          {project.description && (
            <p className="text-sm text-gray-500">{project.description}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 min-w-32">
            <div className="text-sm text-muted-foreground">Progress:</div>
            <div className="flex-1">
              <Progress value={projectProgress} className="h-2" />
            </div>
            <span className="text-sm text-muted-foreground">
              {projectProgress}%
            </span>
          </div>

          <Button onClick={() => setIsCreateTask(true)}>Add Task</Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setTaskFilter("All")}>
                All Tasks
              </TabsTrigger>
              <TabsTrigger value="todo" onClick={() => setTaskFilter("To Do")}>
                To Do
              </TabsTrigger>
              <TabsTrigger
                value="in-progress"
                onClick={() => setTaskFilter("In Progress")}
              >
                In Progress
              </TabsTrigger>
              <TabsTrigger value="done" onClick={() => setTaskFilter("Done")}>
                Done
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center text-sm">
              <span className="text-muted-foreground">Status:</span>
              <div>
                <Badge variant="outline" className="bg-background">
                  {tasks.filter((task) => task.status === "To Do").length} To Do
                </Badge>
                <Badge variant="outline" className="bg-background">
                  {tasks.filter((task) => task.status === "In Progress").length}{" "}
                  In Progress
                </Badge>
                <Badge variant="outline" className="bg-background">
                  {tasks.filter((task) => task.status === "Done").length} Done
                </Badge>
              </div>
            </div>
          </div>

          <TabsContent value="all" className="m-0">
            <div className="grid grid-cols-3 gap-4">
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((task) => task.status === "To Do")}
                onTaskClick={handleTaskClick}
              />

              <TaskColumn
                title="In Progress"
                tasks={tasks.filter((task) => task.status === "In Progress")}
                onTaskClick={handleTaskClick}
              />

              <TaskColumn
                title="Done"
                tasks={tasks.filter((task) => task.status === "Done")}
                onTaskClick={handleTaskClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="todo" className="m-0">
            <div className="grid md:grid-cols-1 gap-4">
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((task) => task.status === "To Do")}
                onTaskClick={handleTaskClick}
                isFullWidth
              />
            </div>
          </TabsContent>

          <TabsContent value="in-progress" className="m-0">
            <div className="grid md:grid-cols-1 gap-4">
              <TaskColumn
                title="In Progress"
                tasks={tasks.filter((task) => task.status === "In Progress")}
                onTaskClick={handleTaskClick}
                isFullWidth
              />
            </div>
          </TabsContent>

          <TabsContent value="done" className="m-0">
            <div className="grid md:grid-cols-1 gap-4">
              <TaskColumn
                title="Done"
                tasks={tasks.filter((task) => task.status === "Done")}
                onTaskClick={handleTaskClick}
                isFullWidth
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* create    task dialog */}
      <CreateTaskDialog
        open={isCreateTask}
        onOpenChange={setIsCreateTask}
        projectId={projectId!}
        projectMembers={project.members as any}
      />
    </div>
  );
};

export default ProjectDetails;

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  isFullWidth?: boolean;
}

const TaskColumn = ({
  title,
  tasks,
  onTaskClick,
  isFullWidth = false,
}: TaskColumnProps) => {
  return (
  <div
    className={cn(
      "grid gap-4",
      isFullWidth ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : ""
    )}
  >
    <div
      className={cn(
        "space-y-4",
        !isFullWidth ? "h-full" : "col-span-full mb-4"
      )}
    >
      {!isFullWidth && (
        <div className="flex items-center justify-between px-2">
          <h1 className="font-medium text-base sm:text-lg">{title}</h1>
          <Badge variant="outline">{tasks.length}</Badge>
        </div>
      )}

      <div
        className={cn(
          isFullWidth
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-3 px-2"
        )}
      >
        {tasks.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-4">
            No tasks yet
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={() => onTaskClick(task._id)}
            />
          ))
        )}
      </div>
    </div>
  </div>
);

};

const TaskCard = ({ task, onClick }: { task: Task; onClick: () => void }) => {
  return (
    <Card
  onClick={onClick}
  className="cursor-pointer hover:shadow-md transition-all duration-300 hover:translate-y-1 w-full"
>
  <CardHeader className="pb-2">
    <div className="flex items-center justify-between gap-2">
      <Badge
        className={cn(
          "text-xs px-2 py-0.5",
          task.priority === "High"
            ? "bg-red-500 text-white"
            : task.priority === "Medium"
            ? "bg-orange-500 text-white"
            : "bg-slate-500 text-white"
        )}
      >
        {task.priority}
      </Badge>

      <div className="flex gap-1 shrink-0">
        {task.status !== "To Do" && (
          <Button variant="ghost" size="icon" className="size-6">
            <AlertCircle className="size-4" />
          </Button>
        )}
        {task.status !== "In Progress" && (
          <Button variant="ghost" size="icon" className="size-6">
            <Clock className="size-4 sm:hidden" />
          </Button>
        )}
        {task.status !== "Done" && (
          <Button variant="ghost" size="icon" className="size-6">
            <CheckCircle className="size-4 sm:hidden" />
          </Button>
        )}
      </div>
    </div>
  </CardHeader>

  <CardContent className="space-y-2">
    <h4 className="font-medium text-sm break-words">{task.title}</h4>

    {task.description && (
      <p className="text-xs text-muted-foreground line-clamp-2">
        {task.description}
      </p>
    )}

    <div className="flex items-center justify-between text-xs flex-wrap gap-2">
      {task.assignees && task.assignees.length > 0 ? (
        <div className="flex -space-x-2">
          {task.assignees.slice(0, 5).map((member) => (
            <Avatar
              key={member._id}
              className="size-6 bg-gray-700 rounded-full border border-white"
              title={member.name}
            >
              <AvatarImage src={member.profilePicture} />
              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
          {task.assignees.length > 5 && (
            <span className="text-[10px] text-muted-foreground pl-1">
              +{task.assignees.length - 5}
            </span>
          )}
        </div>
      ) : (
        <span className="text-[11px] text-muted-foreground">Unassigned</span>
      )}

      {task.dueDate && (
        <div className="text-[11px] text-muted-foreground flex items-center whitespace-nowrap">
          <Calendar className="size-3 mr-1" />
          {format(new Date(task.dueDate), "MMM d, yyyy")}
        </div>
      )}
    </div>

    {task.subtasks && task.subtasks.length > 0 && (
      <div className="text-[11px] text-muted-foreground">
        {task.subtasks.filter((s) => s.completed).length} /{" "}
        {task.subtasks.length} subtasks
      </div>
    )}
  </CardContent>
</Card>

  );
};