// Convert database rows (snake_case) into the JSON shape the Angular frontend expects (camelCase).

export function toUser(row) {
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}

export function toTask(row) {
  return {
    id: String(row.id),
    title: row.title,
    description: row.description,
    priority: row.priority,
    dueDate: row.due_date ?? '',
    status: row.status,
    userId: String(row.user_id),
    userName: row.user_name ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}
