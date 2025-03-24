import { useEffect, useState } from 'react';
import { ROLE_PERMISSIONS, ROLES } from '../config/roles';

type RoleId = (typeof ROLES)[keyof typeof ROLES];

export const useRoleAccess = () => {
  const [userRole, setUserRole] = useState<RoleId | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const { rol_id } = JSON.parse(userData);
      const roleId = rol_id as RoleId;
      setUserRole(roleId);
      setPermissions(ROLE_PERMISSIONS[roleId as RoleId]?.slice() || []);
    }
    setIsLoading(false);
  }, []);

  const hasAccess = (module: string) => {
    if (isLoading) return true;
    return permissions.includes(module);
  };

  return { hasAccess, userRole, isLoading };
};