import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { authenticate } from "@/middleware/auth";
import { createTask, getTasks } from "@/modules/tasks/task.service";

export async function POST(req: Request) {
  try {
    await connectDB();

    const user: any = await authenticate();

    const body = await req.json();

    const task = await createTask(body, user.userId);

    return NextResponse.json(task, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 400 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    await authenticate();

    const { searchParams } = new URL(req.url);

    const filters = {
      status: searchParams.get("status"),
      priority: searchParams.get("priority"),
      assignedUser: searchParams.get("assignedUser"),
      search: searchParams.get("search"),
      // If you support these in your repository layer:
      // from: searchParams.get("from"),
      // to: searchParams.get("to"),
    };

    const limit = Number(searchParams.get("limit")) || 10;
    const cursor = searchParams.get("cursor") || undefined;

    const tasks = await getTasks(filters, limit, cursor);

    const nextCursor =
      tasks.length === limit ? tasks[tasks.length - 1]._id : null;

    return NextResponse.json({ tasks, nextCursor });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 400 }
    );
  }
}