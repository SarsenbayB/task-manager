"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Task, TaskLane } from "./types";
import { v4 as uuidv4 } from "uuid";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface TaskContextProps {
    lanes: TaskLane[];
    isLoading: boolean;
    addTask: (task: Omit<Task, "id">) => void;
    updateTask: (task: Task) => void;
    deleteTask: (taskId: string) => void;
    moveTask: (taskId: string, newStatus: "todo" | "inProgress" | "completed") => void;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    const { data: lanes = [], isLoading } = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const response = await axios.get("/api/tasks");
            return response.data;
        },
    });

    const addTaskMutation = useMutation({
        mutationFn: async (task: Omit<Task, "id">) => {
            const newTask = { id: uuidv4(), ...task };
            await axios.post("/api/tasks/", newTask);
            return newTask;
        },
        onMutate: async (newTask) => {
            queryClient.cancelQueries({ queryKey: ["tasks"] });

            const previousTasks = queryClient.getQueryData<TaskLane[]>(["tasks"]);

            queryClient.setQueryData<TaskLane[]>(["tasks"], (oldLanes = []) => {
                const newLanes = [...oldLanes];
                const laneIndex = newLanes.findIndex(lane => lane.status === newTask.status);
                if (laneIndex !== -1) {
                    newLanes[laneIndex].tasks.push({ id: uuidv4(), ...newTask });
                }
                return newLanes;
            });

            return { previousTasks };
        },
        onError: (_error, _newTask, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(["tasks"], context.previousTasks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    const updateTaskMutation = useMutation({
        mutationFn: async (task: Task) => {
            await axios.put(`/api/tasks/${task.id}`, task);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    const deleteTaskMutation = useMutation({
        mutationFn: async (taskId: string) => {
            await axios.delete(`/api/tasks/${taskId}`);
        },
        onMutate: async (taskId) => {
            queryClient.cancelQueries({ queryKey: ["tasks"] });

            const previousTasks = queryClient.getQueryData<TaskLane[]>(["tasks"]);

            queryClient.setQueryData<TaskLane[]>(["tasks"], (oldLanes = []) =>
                oldLanes.map(lane => ({
                    ...lane,
                    tasks: lane.tasks.filter(task => task.id !== taskId),
                }))
            );

            return { previousTasks };
        },
        onError: (_error, _taskId, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(["tasks"], context.previousTasks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    const moveTaskMutation = useMutation({
        mutationFn: async ({ taskId, newStatus }: { taskId: string; newStatus: "todo" | "inProgress" | "completed" }) => {
            await axios.patch(`/api/tasks/${taskId}`, { status: newStatus });
        },
        onMutate: async ({ taskId, newStatus }) => {
            queryClient.cancelQueries({ queryKey: ["tasks"] });

            const previousTasks = queryClient.getQueryData<TaskLane[]>(["tasks"]);

            queryClient.setQueryData<TaskLane[]>(["tasks"], (oldLanes = []) => {
                const newLanes = oldLanes.map(lane => ({
                    ...lane,
                    tasks: lane.tasks.filter(task => task.id !== taskId),
                }));

                const taskToMove = oldLanes.flatMap(lane => lane.tasks).find(task => task.id === taskId);

                if (taskToMove) {
                    const newLaneIndex = newLanes.findIndex(lane => lane.status === newStatus);
                    if (newLaneIndex !== -1) {
                        newLanes[newLaneIndex].tasks.push({ ...taskToMove, status: newStatus });
                    }
                }

                return newLanes;
            });

            return { previousTasks };
        },
        onError: (_error, _variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(["tasks"], context.previousTasks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    return (
        <TaskContext.Provider
            value={{
                lanes,
                isLoading,
                addTask: (task) => addTaskMutation.mutate(task),
                updateTask: (task) => updateTaskMutation.mutate(task),
                deleteTask: (taskId) => deleteTaskMutation.mutate(taskId),
                moveTask: (taskId, newStatus) => moveTaskMutation.mutate({ taskId, newStatus }),
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error("useTaskContext must be used within a TaskProvider");
    }
    return context;
};