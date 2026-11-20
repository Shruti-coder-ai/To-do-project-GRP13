import db from '../db.js';

// 1) Must be logged in (valid token) and the account must still be ACTIVE.
export async function authenticate(request, reply) {
  try {
    await request.jwtVerify();
  } catch {
    return reply.code(401).send({ message: 'Unauthorized: please log in' });
  }

  const user = await db('users').where({ id: request.user.id }).first();
  if (!user) {
    return reply.code(401).send({ message: 'Unauthorized: account no longer exists' });
  }
  if (user.status !== 'ACTIVE') {
    return reply.code(403).send({ message: 'Your account has been deactivated by an Administrator.' });
  }
  // Use the role from the database, not only from the token
  request.user.role = user.role;
}

// 2) Must be an ADMIN (use after authenticate).
export async function requireAdmin(request, reply) {
  if (request.user.role !== 'ADMIN') {
    return reply.code(403).send({ message: 'Forbidden: admin access only' });
  }
}
