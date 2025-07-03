import { fetchData } from "@/lib/fetch-utils";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../loader";

export const TaskActivity = ({ resouceId }: { resouceId: string }) => {

  const { data, isPending } = useQuery({
    queryKey: ["task-activity", resouceId],
    queryFn: () => fetchData(`/tasks/${resouceId}/activity`)
  });

  if(isPending) return <Loader/>
 
  return( <div></div>);
};
