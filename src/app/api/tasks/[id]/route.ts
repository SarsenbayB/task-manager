import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Задача удалена" });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при удалении задачи" },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: "Ошибка при обновлении задачи" },
      { status: 500 }
    );
  }
}

// Add this for PUT requests as mentioned in your TaskContext.tsx
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
    return NextResponse.json(
      { error: "Ошибка при обновлении задачи" },
      { status: 500 }
    );
  }
}
