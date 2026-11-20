// Creates the demo accounts used by the frontend (run once:  npm run seed)
import bcrypt from 'bcrypt';
import db from './db.js';

const accounts = [
  { name: 'angrevyas',          email: 'angrevyas@gmail.com', password: 'Angre@123', role: 'ADMIN' },
  { name: 'Demo Administrator', email: 'admin@taskflow.dev',  password: 'Admin@123', role: 'ADMIN' },
  { name: 'Demo User',          email: 'user@taskflow.dev',   password: 'User@123',  role: 'USER'  },
];

for (const a of accounts) {
  const exists = await db('users').where({ email: a.email }).first();
  if (exists) {
    console.log(`skip (already exists): ${a.email}`);
    continue;
  }
  await db('users').insert({
    name: a.name,
    email: a.email,
    password_hash: await bcrypt.hash(a.password, 10),
    role: a.role,
    status: 'ACTIVE',
  });
  console.log(`created ${a.role}: ${a.email}`);
}

await db.destroy();
