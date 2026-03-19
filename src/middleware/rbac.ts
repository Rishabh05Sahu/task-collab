// src/middleware/rbac.ts
export function authorize(roles: string[], userRole: string) {
  if (!roles.includes(userRole)) {
    const error: any = new Error("Forbidden");
    error.status = 403;
    throw error;
  }
}