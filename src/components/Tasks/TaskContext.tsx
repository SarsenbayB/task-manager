"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Task, TaskLane } from "./types";
import { v4 as uuidv4 } from "uuid";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface TaskContextProps {
    lanes: TaskLane[];
    addTask: (task: Omit<Task, "id">) => void;
    updateTask: (task: Task) => void;
    deleteTask: (taskId: string) => void;
    moveTask: (taskId: string, newStatus: "todo" | "inProgress" | "completed") => void;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    const { data: lanes = [] } = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const response = await axios.get("/api/tasks");
            return response.data;
        },
    });

    const addTaskMutation = useMutation({
        mutationFn: async (task: Omit<Task, "id">) => {
            await axios.post("/api/tasks/", task);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    // Новый `moveTaskMutation`
    const moveTaskMutation = useMutation({
        mutationFn: async ({ taskId, newStatus }: { taskId: string; newStatus: string }) => {
            await axios.patch(`/api/tasks/${taskId}`, { status: newStatus });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });
    return (
        <TaskContext.Provider
            value={{
                lanes,
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