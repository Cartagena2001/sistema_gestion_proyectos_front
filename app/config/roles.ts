export const ROLES = {
  ADMIN: 1,
  MEMBER: 2,
  MANAGER: 4
} as const;

type RoleId = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_PERMISSIONS: Record<RoleId, readonly string[]> = {
  1: ['dashboard', 'projects', 'tasks', 'task_users', 'users'],
  2: ['dashboard', 'task_users', 'project_view'],
  4: ['dashboard', 'projects', 'tasks', 'task_users']
};