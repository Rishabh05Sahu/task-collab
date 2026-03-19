// src/app/api/tasks/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { authenticate } from "@/middleware/auth";
import {
  updateTask,
  deleteTask,
  getTaskById,
} from "@/modules/tasks/task.service";

// GET /api/tasks/:id
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    await authenticate(); // any logged-in user can view

    const { id } = await context.params;

    const task = await getTaskById(id);

    return NextResponse.json(task);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 400 }
    );
  }
}

// PATCH /api/tasks/:id
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = await authenticate(); // { userId, role }

    const { id } = await context.params;

    const body = await req.json();
    const { version, ...data } = body;

    const updatedTask = await updateTask(
      id,
      data,
      version,
      user.userId,
      user.role
    );

    return NextResponse.json(updatedTask);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 400 }
    );
  }
}

// DELETE /api/tasks/:id
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = await authenticate(); // { userId, role }

    const { id } = await context.params;

    const result = await deleteTask(id, user.userId, user.role);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 400 }
    );
  }
}