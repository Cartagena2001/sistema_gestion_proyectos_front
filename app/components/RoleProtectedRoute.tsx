"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoleAccess } from '../hooks/useRoleAccess';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission: string;
}

export const RoleProtectedRoute = ({ children, requiredPermission }: RoleProtectedRouteProps) => {
  const router = useRouter();
  const { hasAccess, isLoading } = useRoleAccess();

  useEffect(() => {
    if (!isLoading && !hasAccess(requiredPermission)) {
      router.push('/dashboard');
    }
  }, [requiredPermission, hasAccess, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>; // O tu componente de loading
  }

  return hasAccess(requiredPermission) ? <>{children}</> : null;
};