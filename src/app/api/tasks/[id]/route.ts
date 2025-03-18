import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting task" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const updatedTask = await prisma.task.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: "Error updating task" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const updatedTask = await prisma.task.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: "Error updating task" }, { status: 500 });
  }
}
