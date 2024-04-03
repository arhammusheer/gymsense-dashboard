import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { RiRepeat2Line } from "react-icons/ri";
import { useParams } from "react-router-dom";
import PageHeader from "../components/headers/PageHeader";
import { Iot, iot } from "../redux/apis/api.slice";
import { useAppSelector } from "../redux/store";

export default function Iot() {
  const id = useParams<{ id: string }>().id || "";
  const { isLoading, data, isSuccess, refetch } = iot.getIot(id);

  const [occupied, setOccupied] = useState<"Taken" | "Available" | "Unknown">(
    "Unknown"
  );

  const bg = () => {
    switch (occupied) {
      case "Taken":
        return "red.500";
      case "Available":
        return "green.500";
      default:
        return "gray.500";
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setOccupied(data.occupancy ? "Taken" : "Available");
    }
  }, [data, isSuccess]);

  const title = () => {
    if (data && data.name) return data.name;
    if (data && data.id) return data.id;

    return "Unknown";
  };

  return (
    <Box>
      <Box p={8} bg={bg()} color="white">
        <PageHeader
          title={title()}
          subtitle="Device Information"
          isLoading={isLoading}
        >
          <RefetchButton refetch={() => refetch()} />
        </PageHeader>
        {isSuccess && (
          <Box>
            <Box>Name: {data.name || data.id}</Box>
            <Box>Occupancy: {occupied}</Box>
            <Box>Battery Level: {data.batteryLevel}%</Box>
          </Box>
        )}
      </Box>
      {data && <AdminControls data={data} />}
    </Box>
  );
}

const RefetchButton = ({ refetch }: { refetch: () => void }) => {
  return (
    <Box>
      <IconButton
        onClick={refetch}
        aria-label="Refetch"
        icon={<RiRepeat2Line />}
        variant={"ghost"}
      />
    </Box>
  );
};

// Allows viewing "key", viewing and modifying "name" and "location"
const AdminControls = ({ data }: { data: Iot }) => {
  const { permissions } = useAppSelector((state) => state.auth);
  const hasPermission = useCallback(
    (id: string) => hasPermissionToModify(permissions, id),
    [permissions]
  );

  const copyOnClick = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Stack p={8} hidden={!hasPermission(data.id)} maxW={"md"}>
      <Heading>Admin Controls</Heading>
      <Stack spacing={4} py={4}>
        <FormControl>
          <FormLabel>Id</FormLabel>
          <Tooltip
            label="Copy to clipboard"
            aria-label="Copy to clipboard"
            hasArrow
          >
            <Input
              value={data.id}
              isReadOnly
              onClick={() => copyOnClick(data.id)}
            />
          </Tooltip>
          <FormHelperText>Device Unique Identifier</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Key</FormLabel>
          <Tooltip
            label="Copy to clipboard"
            aria-label="Copy to clipboard"
            hasArrow
          >
            <Input
              value={data.key}
              isReadOnly
              onClick={() => copyOnClick(data.key || "")}
            />
          </Tooltip>
          <FormHelperText>Security key for this device</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input value={data.name} />
          <FormHelperText>Device name</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Location</FormLabel>
          <Input value={data.location} />
          <FormHelperText>Device location</FormHelperText>
        </FormControl>
      </Stack>
    </Stack>
  );
};

const hasPermissionToModify = (permissions: string[], idOfDevice: string) => {
  for (const permission of permissions) {
    const [domain, action, target] = permission.split(":");
    if (domain !== "iot" && domain !== "admin") return false;
    if (action !== "update" && action !== "admin") return false;
    if (target !== idOfDevice && target !== "*") return false;
    return true;
  }
};
