import { Metadata } from "next";
import DefaultLayout from "@/app/DefaultLaout";
import React from "react";
import TaskHeader from "@/components/Tasks/TaskHeader";
import TaskKanban from "@/components/Tasks/TaskKanban";
import { TaskProvider } from "@/components/Tasks/TaskContext";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Home page for NextAdmin Dashboard Kit",
};

export default async function Home() {

  return (
    <>
      <DefaultLayout>
        <TaskProvider>
          <TaskHeader />
          <TaskKanban />
        </TaskProvider>
      </DefaultLayout>
    </>
  );
}