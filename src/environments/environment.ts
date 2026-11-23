/**
 * Development Environment Configuration
 *
 * - apiUrl: Base URL of the Fastify backend (defaulting to http://localhost:3000/api)
 * - useMockData: When true, services use local mock storage for frontend-first development.
 *   When the Fastify backend is ready, toggle this to false to connect directly to the real API!
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  useMockData: true
};
