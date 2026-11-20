import bcrypt from 'bcrypt';
import db from '../db.js';
import { toUser } from '../mappers.js';

export default async function authRoutes(app) {
  // POST /api/auth/register  -> always creates a USER (never an admin)
  app.post('/api/auth/register', {
    schema: {
      body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 100 },
          email: { type: 'string', format: 'email', maxLength: 150 },
          password: { type: 'string', minLength: 6, maxLength: 100 },
        },
      },
    },
  }, async (request, reply) => {
    const { name, password } = request.body;
    const email = request.body.email.trim().toLowerCase();

    const existing = await db('users').where({ email }).first();
    if (existing) {
      return reply.code(409).send({ message: 'An account with this email already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const [row] = await db('users')
      .insert({ name: name.trim(), email, password_hash, role: 'USER', status: 'ACTIVE' })
      .returning('*');

    const token = app.jwt.sign({ id: row.id, role: row.role }, { expiresIn: '8h' });
    return reply.code(201).send({
      token,
      user: toUser(row),
      message: 'Account created successfully!',
    });
  });

  // POST /api/auth/login  -> works for both users and admins
  app.post('/api/auth/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    const email = request.body.email.trim().toLowerCase();
    const { password } = request.body;

    const row = await db('users').where({ email }).first();
    if (!row || !(await bcrypt.compare(password, row.password_hash))) {
      return reply.code(401).send({ message: 'Invalid email or password. Please verify your credentials.' });
    }
    if (row.status !== 'ACTIVE') {
      return reply.code(403).send({ message: 'Your account has been deactivated by an Administrator.' });
    }

    const token = app.jwt.sign({ id: row.id, role: row.role }, { expiresIn: '8h' });
    return { token, user: toUser(row) };
  });
}
