-- Run this in pgAdmin > todo_db > Query Tool
-- WARNING: drops the old test tables and recreates them.
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(10)  NOT NULL DEFAULT 'USER'   CHECK (role   IN ('USER','ADMIN')),
  status        VARCHAR(10)  NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE')),
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP
);

CREATE TABLE tasks (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(200) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  priority    VARCHAR(10) NOT NULL DEFAULT 'Medium'  CHECK (priority IN ('Low','Medium','High')),
  due_date    DATE,
  status      VARCHAR(10) NOT NULL DEFAULT 'Pending' CHECK (status   IN ('Pending','Completed')),
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
