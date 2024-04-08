import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { CgCheck } from "react-icons/cg";
import { RiRepeat2Line } from "react-icons/ri";
import {
  TbBattery,
  TbBattery1,
  TbBattery2,
  TbBattery3,
  TbBattery4,
  TbBatteryOff,
} from "react-icons/tb";
import { TiTimes } from "react-icons/ti";
import { useParams } from "react-router-dom";
import PageHeader from "../components/headers/PageHeader";
import type { Iot } from "../redux/apis/api.slice";
import { iot } from "../redux/apis/api.slice";
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

  const subtitle = () => {
    if (isSuccess) {
      return `Occupancy: ${occupied}`;
    }
    return "Device Information";
  };

  if (!isSuccess && !isLoading) {
    return (
      <Box p={8}>
        <PageHeader title="Unknown Device" subtitle="Device Information" />
      </Box>
    );
  }

  return (
    <Box>
      <Box p={8} bg={bg()} color="white">
        <PageHeader title={title()} subtitle={subtitle()} isLoading={isLoading}>
          <RefetchButton refetch={() => refetch()} />
        </PageHeader>
      </Box>
      {data && <AdminControls data={data} />}
    </Box>
  );
}

const BatteryLevel = ({ level }: { level: number }) => {
  if (level < 0) return <Icon h={"2rem"} w={"2rem"} as={TbBatteryOff} />;
  if (level === 0) return <Icon h={"2rem"} w={"2rem"} as={TbBattery1} />;
  if (level <= 25) return <Icon h={"2rem"} w={"2rem"} as={TbBattery2} />;
  if (level <= 50) return <Icon h={"2rem"} w={"2rem"} as={TbBattery3} />;
  if (level <= 75) return <Icon h={"2rem"} w={"2rem"} as={TbBattery4} />;
  return <Icon h={"2rem"} w={"2rem"} as={TbBattery} />;
};

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
      <BatteryLevel level={data.batteryLevel || -1} />
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

        <MutableField
          label="Name"
          name="name"
          id={data.id}
          defaultValue={data.name || ""}
          helptext="Device name"
        />

        <MutableField
          label="Location"
          name="location"
          id={data.id}
          defaultValue={data.location || ""}
          helptext="Device location"
        />
      </Stack>
    </Stack>
  );
};

const MutableField = ({
  label,
  name,
  id,
  defaultValue,
  helptext,
}: {
  label: string;
  name: string;
  id: string;
  defaultValue: string;
  helptext?: string;
}) => {
  const [updateIot, { isLoading }] = iot.updateIot();

  const [value, setValue] = useState(defaultValue);

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <InputGroup gap={2}>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateIot({ id, [name]: value });
            }
            if (e.key === "Escape") {
              setValue(defaultValue);
            }
          }}
        />
        <IconButton
          hidden={value === defaultValue}
          isLoading={isLoading}
          onClick={() => {
            updateIot({ id, [name]: value });
          }}
          colorScheme="green"
          aria-label="Update"
          icon={<Icon as={CgCheck} size="sm" />}
        />
        <IconButton
          hidden={value === defaultValue}
          onClick={() => setValue(defaultValue)}
          colorScheme="red"
          aria-label="Reset"
          icon={<Icon as={TiTimes} size="sm" />}
        />
      </InputGroup>
      {helptext && <FormHelperText>{helptext}</FormHelperText>}
    </FormControl>
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
