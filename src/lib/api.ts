import { Todo } from "@/types/todo";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function fetchTodos(params?: {
  limit?: number;
  page?: number;
}): Promise<{
  success: boolean;
  data: Todo[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
}> {
  const limit = params?.limit ?? 10;
  const page = params?.page ?? 1;
  const url = new URL(`${BASE}/todos`);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("page", String(page));

  const r = await fetch(url.toString(), { cache: "no-store" });
  if (!r.ok) throw new Error(`Failed to fetch todos (page ${page})`);
  return await r.json();
}

export async function getTodo(
  id: number
): Promise<{ success: boolean; data: Todo }> {
  const r = await fetch(`${BASE}/todos/${id}`, { cache: "no-store" });
  if (!r.ok) throw new Error("Todo not found");
  return r.json();
}

export async function createTodo(data: { title: string; color?: string }) {
  const r = await fetch(`${BASE}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("Create failed");
  return r.json();
}

export async function updateTodo(
  id: number,
  data: Partial<Pick<Todo, "title" | "completed" | "color">>
) {
  const r = await fetch(`${BASE}/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("Update failed");
  return r.json();
}

export async function toggleTodo(id: number, completed: boolean) {
  const r = await fetch(`${BASE}/todos/${id}/complete`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  if (!r.ok) throw new Error("Completed failed");
  return r.json();
}

export async function deleteTodo(id: number) {
  const r = await fetch(`${BASE}/todos/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error("Delete failed");
  return r.json();
}
