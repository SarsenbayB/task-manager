import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

// const prisma = new PrismaClient();

export async function GET() {
  try {
    const tasks = await prisma.task.findMany();
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при получении задач" },
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
    return NextResponse.json(
      { error: "Ошибка при создании задачи" },
      { status: 500 }
    );
  }
}
