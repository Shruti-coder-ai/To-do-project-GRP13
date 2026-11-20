import db from '../db.js';
import { authenticate, requireAdmin } from '../plugins/auth.js';
import { toUser, toTask } from '../mappers.js';

const idParams = {
  type: 'object',
  required: ['id'],
  properties: { id: { type: 'integer', minimum: 1 } },
};

export default async function adminRoutes(app) {
  // Every route here needs: valid login AND admin role
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', requireAdmin);

  // GET /api/admin/users  -> all registered users
  app.get('/api/admin/users', async () => {
    const rows = await db('users').orderBy('created_at', 'desc');
    return rows.map(toUser);
  });

  // GET /api/admin/tasks  -> all tasks with owner name
  app.get('/api/admin/tasks', async () => {
    const rows = await db('tasks')
      .join('users', 'users.id', 'tasks.user_id')
      .select('tasks.*', 'users.name as user_name')
      .orderBy('tasks.created_at', 'desc');
    return rows.map(toTask);
  });

  // PATCH /api/admin/users/:id/status  -> activate / deactivate
  app.patch('/api/admin/users/:id/status', {
    schema: {
      params: idParams,
      body: {
        type: 'object',
        required: ['status'],
        properties: { status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] } },
      },
    },
  }, async (request, reply) => {
    const { id } = request.params;
    if (id === request.user.id) {
      return reply.code(400).send({ message: 'You cannot change your own account status.' });
    }
    const [row] = await db('users')
      .where({ id })
      .update({ status: request.body.status, updated_at: db.fn.now() })
      .returning('*');
    if (!row) return reply.code(404).send({ message: 'User not found' });
    return toUser(row);
  });

  // PATCH /api/admin/users/:id/role  -> change role USER <-> ADMIN
  app.patch('/api/admin/users/:id/role', {
    schema: {
      params: idParams,
      body: {
        type: 'object',
        required: ['role'],
        properties: { role: { type: 'string', enum: ['USER', 'ADMIN'] } },
      },
    },
  }, async (request, reply) => {
    const { id } = request.params;
    if (id === request.user.id) {
      return reply.code(400).send({ message: 'You cannot change your own role.' });
    }
    const [row] = await db('users')
      .where({ id })
      .update({ role: request.body.role, updated_at: db.fn.now() })
      .returning('*');
    if (!row) return reply.code(404).send({ message: 'User not found' });
    return toUser(row);
  });

  // DELETE /api/admin/users/:id  -> remove a user (their tasks are deleted too)
  app.delete('/api/admin/users/:id', { schema: { params: idParams } }, async (request, reply) => {
    const { id } = request.params;
    if (id === request.user.id) {
      return reply.code(400).send({ message: 'You cannot delete your own account.' });
    }
    const count = await db('users').where({ id }).del();
    if (!count) return reply.code(404).send({ message: 'User not found' });
    return reply.code(204).send();
  });

  // GET /api/admin/stats  -> task statistics
  app.get('/api/admin/stats', async () => {
    const [{ count: totalUsers }] = await db('users').count('* as count');
    const [{ count: activeUsers }] = await db('users').where({ status: 'ACTIVE' }).count('* as count');
    const byStatus = await db('tasks').select('status').count('* as count').groupBy('status');
    const byPriority = await db('tasks').select('priority').count('* as count').groupBy('priority');

    const s = (rows, key, value) => Number(rows.find((r) => r[key] === value)?.count ?? 0);
    const pending = s(byStatus, 'status', 'Pending');
    const completed = s(byStatus, 'status', 'Completed');

    return {
      totalUsers: Number(totalUsers),
      activeUsers: Number(activeUsers),
      totalTasks: pending + completed,
      pendingTasks: pending,
      completedTasks: completed,
      priorityDistribution: {
        low: s(byPriority, 'priority', 'Low'),
        medium: s(byPriority, 'priority', 'Medium'),
        high: s(byPriority, 'priority', 'High'),
      },
      statusDistribution: { pending, completed },
    };
  });
}
