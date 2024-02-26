import {
  Box,
  Table,
  TableCaption,
  TableContainer,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import PageHeader from "../components/headers/PageHeader";
import { useAuth } from "../hooks/useAuth";

export default function Roles() {
  const { permissions } = useAuth();
  return (
    <Box>
      <PageHeader title="Role Management" subtitle="Manage user roles" />
      <YourRoles permissions={permissions} />
    </Box>
  );
}

const YourRoles = ({ permissions }: { permissions: string[] }) => {
  return (
    <TableContainer>
      <Table>
        <TableCaption>Your roles</TableCaption>
        <Thead>
          <Tr>
            <Th>Domain</Th>
            <Th>Action</Th>
            <Th>Target</Th>
          </Tr>
        </Thead>
        {permissions.map((permission) => {
          const { domain, action, target } = parsePermission(permission);
          return (
            <Tr key={permission}>
              <Td>{domain}</Td>
              <Td>{action}</Td>
              <Td>{target}</Td>
            </Tr>
          );
        })}
      </Table>
    </TableContainer>
  );
};

/**
 * 
 * interface PermissionCheckOptions {
  domain: Domain; // The domain to check the permission for "user", "iot", "hub", "admin"
  action: Action; // The action to check the permission for "create", "read", "update", "delete
  target: string | "*"; // The target to check the permission for (iot_id, hub_id, user_id, *)
}
 */

type Domain = "user" | "iot" | "hub" | "admin";
type Action = "create" | "read" | "update" | "delete";

interface PermissionCheckOptions {
  domain: Domain;
  action: Action;
  target: string | "*";
}

const parsePermission = (permission: string): PermissionCheckOptions => {
  const [domain, action, target] = permission.split(":") as [
    Domain,
    Action,
    string
  ];

  return { domain, action, target };
};
