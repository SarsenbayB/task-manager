import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch tasks and organize them into lanes
    const tasks = await prisma.task.findMany();

    // Group tasks by status
    const todoTasks = tasks.filter((task) => task.status === "todo");
    const inProgressTasks = tasks.filter(
      (task) => task.status === "inProgress"
    );
    const completedTasks = tasks.filter((task) => task.status === "completed");

    // Create lanes structure
    const lanes = [
      {
        title: "To Do",
        status: "todo",
        tasks: todoTasks,
      },
      {
        title: "In Progress",
        status: "inProgress",
        tasks: inProgressTasks,
      },
      {
        title: "Completed",
        status: "completed",
        tasks: completedTasks,
      },
    ];

    return NextResponse.json(lanes);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching tasks" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newTask = await prisma.task.create({
      data: body,
    });
    return NextResponse.json(newTask);
  } catch (error) {
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}
