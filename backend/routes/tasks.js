import db from '../db.js';
import { authenticate } from '../plugins/auth.js';
import { toTask } from '../mappers.js';

const idParams = {
  type: 'object',
  required: ['id'],
  properties: { id: { type: 'integer', minimum: 1 } },
};

// dueDate must be a real date (YYYY-MM-DD) or empty
const dueDateSchema = {
  anyOf: [{ type: 'string', format: 'date' }, { type: 'string', maxLength: 0 }],
};

// Base query: task + owner name
const taskQuery = () =>
  db('tasks').join('users', 'users.id', 'tasks.user_id').select('tasks.*', 'users.name as user_name');

export default async function taskRoutes(app) {
  // All routes here: logged-in users only, and always limited to THEIR OWN tasks.
  app.addHook('preHandler', authenticate);

  // GET /api/tasks?status=Pending|Completed
  app.get('/api/tasks', {
    schema: {
      querystring: {
        type: 'object',
        properties: { status: { type: 'string', enum: ['Pending', 'Completed'] } },
      },
    },
  }, async (request) => {
    const q = taskQuery().where('tasks.user_id', request.user.id).orderBy('tasks.created_at', 'desc');
    if (request.query.status) q.where('tasks.status', request.query.status);
    return (await q).map(toTask);
  });

  // POST /api/tasks
  app.post('/api/tasks', {
    schema: {
      body: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 200 },
          description: { type: 'string' },
          priority: { type: 'string', enum: ['Low', 'Medium', 'High'] },
          dueDate: dueDateSchema,
        },
      },
    },
  }, async (request, reply) => {
    const { title, description = '', priority = 'Medium', dueDate } = request.body;
    if (!title.trim()) {
      return reply.code(400).send({ message: 'Task title cannot be empty or only spaces.' });
    }
    const [created] = await db('tasks')
      .insert({
        user_id: request.user.id,
        title: title.trim(),
        description,
        priority,
        due_date: dueDate || null,
        status: 'Pending',
      })
      .returning('id');
    const row = await taskQuery().where('tasks.id', created.id).first();
    return reply.code(201).send(toTask(row));
  });

  // PUT /api/tasks/:id   (edit fields and/or mark completed)
  app.put('/api/tasks/:id', {
    schema: {
      params: idParams,
      body: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 200 },
          description: { type: 'string' },
          priority: { type: 'string', enum: ['Low', 'Medium', 'High'] },
          dueDate: dueDateSchema,
          status: { type: 'string', enum: ['Pending', 'Completed'] },
        },
      },
    },
  }, async (request, reply) => {
    const { id } = request.params;
    const { title, description, priority, dueDate, status } = request.body;
    if (title !== undefined && !title.trim()) {
      return reply.code(400).send({ message: 'Task title cannot be empty or only spaces.' });
    }

    const changes = { updated_at: db.fn.now() };
    if (title !== undefined) changes.title = title.trim();
    if (description !== undefined) changes.description = description;
    if (priority !== undefined) changes.priority = priority;
    if (dueDate !== undefined) changes.due_date = dueDate || null;
    if (status !== undefined) changes.status = status;

    // user_id in the WHERE clause = ownership check (users cannot touch other people's tasks)
    const count = await db('tasks').where({ id, user_id: request.user.id }).update(changes);
    if (!count) return reply.code(404).send({ message: 'Task not found' });

    const row = await taskQuery().where('tasks.id', id).first();
    return toTask(row);
  });

  // DELETE /api/tasks/:id
  app.delete('/api/tasks/:id', { schema: { params: idParams } }, async (request, reply) => {
    const count = await db('tasks').where({ id: request.params.id, user_id: request.user.id }).del();
    if (!count) return reply.code(404).send({ message: 'Task not found' });
    return reply.code(204).send();
  });
}
