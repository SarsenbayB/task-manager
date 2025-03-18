export interface TaskItem {
  id: string;
  name: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  image?: string;
  status: "todo" | "inProgress" | "completed";
  taskItems: TaskItem[];
  isLoading: boolean;
}

export interface TaskLane {
  title: string;
  status: "todo" | "inProgress" | "completed";
  tasks: Task[];
}
