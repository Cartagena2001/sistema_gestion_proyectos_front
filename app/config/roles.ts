export const ROLES = {
  ADMIN: 1,
  MEMBER: 2,
  MANAGER: 4
} as const;

type RoleId = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_PERMISSIONS: Record<RoleId, readonly string[]> = {
  1: ['projects', 'tasks', 'task_users', 'users'],
  2: ['projects', 'task_users'],
  4: ['projects', 'tasks', 'task_users']
};