import { useSelector } from "react-redux";
import { useMemo } from "react";
import { RootState } from "../redux/store";

/**
 * React hook to check if the current user has a specific permission.
 *
 * Usage example:
 * const hasUserReadPermission = usePermission('user', 'read', 'user@example.com');
 *
 * @param {string} domain - The domain to check the permission for ("user", "iot", "hub", "admin").
 * @param {string} action - The action to check the permission for ("create", "read", "update", "delete", "admin").
 * @param {string} target - The target to check the permission for (iot_id, hub_id, user_email, *).
 * @returns {boolean} - True if the user has the specified permission, false otherwise.
 */

const usePermission = (
  domain: string,
  action: string,
  target: string
): boolean => {
  const permissions = useSelector((state: RootState) => state.auth.permissions);

  return useMemo(() => {
    for (const permission of permissions) {
      const [permDomain, permAction, permTarget] = permission.split(":");
      if (permDomain !== domain && permDomain !== "admin") continue;
      if (permAction !== action && permAction !== "admin") continue;
      if (permTarget !== target && permTarget !== "*") continue;
      return true;
    }
    return false;
  }, [permissions, domain, action, target]);
};

export const parsePermission = (permission: string) => {
  const [domain, action, target] = permission.split(":");
  return { domain, action, target };
};

export default usePermission;
