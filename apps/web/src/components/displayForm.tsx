import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { TaskActions } from  "@/components/taskAction";
import { apiClient } from "@repo/openapi";

type Task = {
  id: string;
  title: string;
  description: string;
};

export default function DisplayForm() {
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ["tasks"],
    //https://tms-drizzle-api.vercel.app/
    queryFn: async () => {
      const {data, error} = await apiClient.GET("/");
      if (error) throw new Error("Request failed")
      // return res.json() as Promise<Task[]>;
      return data ?? []
    },
  });
  if(isLoading) return <Card className="w-full sm:max-w-md">
        <CardContent className="pt-6 text-muted-foreground">
          Loading...
        </CardContent>
      </Card>
  if(error) return <Card className="w-full sm:max-w-md">
        <CardContent className="pt-6 text-muted-foreground">
          Error Occured: Error Retriving Data
        </CardContent>
      </Card>

  if (tasks.length === 0) {
    return (
      <Card className="w-full sm:max-w-md">
        <CardContent className="pt-6 text-muted-foreground">
          No task submitted yet.
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Submitted Task</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="border rounded-md p-3 space-y-1">
            <div>
              <h3 className="font-semibold">Task Title</h3>
              <p>{task.title}</p>
            </div>
            <div>
              <h3 className="font-semibold">Task Description</h3>
              <p className="text-muted-foreground">{task.description}</p>
            </div>
            <TaskActions task={task} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
