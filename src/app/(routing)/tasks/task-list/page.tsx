import React from "react";
import { Metadata } from "next";
import TaskList from "@/components/Tasks/TaskList";
import DefaultLayout from "@/app/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TaskHeader from "@/components/Tasks/TaskHeader";
import { structuredAlgoliaHtmlData } from "@/libs/crawlIndex";
import { TaskProvider } from "@/components/Tasks/TaskContext";

export const metadata: Metadata = {
  title: "Next.js Task List Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Task List page for NextAdmin Dashboard Kit",
};
const TaskListPage = async () => {
  await structuredAlgoliaHtmlData({
    pageUrl: `${process.env.SITE_URL}tasks/task-list`,
    htmlString: "",
    title: "Next.js Task List Page",
    type: "page",
    imageURL: "",
  });

  return (
    <DefaultLayout>
      <TaskProvider>
        <div className="mx-auto max-w-5xl">
          <Breadcrumb pageName="Task List" />

          <TaskHeader />
          <TaskList />
        </div>
      </TaskProvider>
    </DefaultLayout>
  );
};

export default TaskListPage;
