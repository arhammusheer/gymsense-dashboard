import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/headers/PageHeader";
import type { Iot } from "../redux/apis/api.slice";
import { iot } from "../redux/apis/api.slice";
import { useAppSelector } from "../redux/store";
import { BiTrash } from "react-icons/bi";
import usePermission from "../hooks/usePermission";

export default function Iot() {
  const id = useParams<{ id: string }>().id || "";
  const { isLoading, data, isSuccess, refetch } = iot.getIot(id);
  const hasDeletePermission = usePermission("iot", "delete", id);

  const [occupied, setOccupied] = useState<"Taken" | "Available" | "Unknown">(
    "Unknown"
  );
  const [isOffline, setIsOffline] = useState(false);

  const bg = () => {
    if (isOffline) return "gray.500";
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
      setIsOffline(data.isOffline);
    }
  }, [data, isSuccess]);

  const title = () => {
    if (data && data.name) return data.name;
    if (data && data.id) return data.id;
    return "Unknown";
  };

  const subtitle = () => {
    if (isSuccess) {
      if (isOffline) return "Device is offline";

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
      <Box p={8} bg={bg()} color={"white"}>
        <PageHeader title={title()} subtitle={subtitle()} isLoading={isLoading}>
          <RefetchButton refetch={() => refetch()} />

          {hasDeletePermission && <DeleteButton id={id} />}
        </PageHeader>
      </Box>
      {data && <AdminControls data={data} />}
      {data && data.timeline && <StateTimeline data={data.timeline} />}
    </Box>
  );
}

function DeleteButton({ id }: { id: string }) {
  const defaultBg = useColorModeValue("white", "black");
  const defaultColor = useColorModeValue("black", "white");
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [deleteIot, { isLoading, isSuccess }] = iot.deleteIot();
  const navigate = useNavigate();

  if (isSuccess) {
    onClose();
    navigate("/");
  }

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <IconButton aria-label="delete" icon={<BiTrash />} colorScheme="red" />
      </PopoverTrigger>
      <PopoverContent bg={defaultBg} color={defaultColor}>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Confirmation</PopoverHeader>
        <PopoverBody>Are you sure you want to delete this device?</PopoverBody>
        <PopoverFooter justifyContent="flex-end">
          <ButtonGroup size="sm">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              isLoading={isLoading}
              onClick={() => {
                deleteIot(id);
              }}
            >
              Delete
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
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

        <MutableCheckbox
          label="Is Offline"
          name="isOffline"
          id={data.id}
          defaultValue={data.isOffline}
          helptext="Device is offline/maintenance"
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

const MutableCheckbox = ({
  label,
  name,
  id,
  defaultValue,
  helptext,
}: {
  label: string;
  name: string;
  id: string;
  defaultValue: boolean;
  helptext?: string;
}) => {
  const [updateIot, { isLoading }] = iot.updateIot();

  const [value, setValue] = useState(defaultValue);

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <InputGroup gap={2}>
        <Input
          value={value ? "true" : "false"}
          isReadOnly
          onClick={() => setValue(!value)}
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

// Transform data parts of total width according to from and to timestamps
const transformData = (
  data: { from: string; to: string; occupancy: boolean }[],
  width: number
) => {
  const total = data.reduce((acc, item) => {
    const from = new Date(item.from).getTime();
    const to = new Date(item.to).getTime();
    return acc + to - from;
  }, 0);

  return data.map((item) => {
    const from = new Date(item.from).getTime();
    const to = new Date(item.to).getTime();
    const occupancy = item.occupancy;
    const w = ((to - from) / total) * width;
    return { from, to, occupancy, w };
  });
};

const relativeHour = (date: Date) => {
  const hour = Intl.DateTimeFormat("en-US", { hour: "numeric" }).format(date);

  return `${hour}`;
};

const StateTimeline = ({
  data,
}: {
  data: { from: string; to: string; occupancy: boolean }[];
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  }, []);

  const transformedData = transformData(data, width);

  return (
    <Stack direction={"column"} spacing={4} p={8}>
      <Stack
        direction={"row"}
        spacing={0}
        ref={ref}
        w={"100%"}
        rounded={"full"}
      >
        {transformedData.map((item, index) => {
          return (
            <Box
              key={index}
              h={"2rem"}
              w={item.w}
              bg={item.occupancy ? "red.500" : "green.500"}
            />
          );
        })}
      </Stack>
      // Tick marks
      <Stack direction={"row"} spacing={0} w={"100%"} justify={"space-between"}>
        <Text hidden={!transformedData.length} fontSize={"xs"}>
          {relativeHour(new Date(data[0].from))}
        </Text>
        <Box display={{ base: "none", md: "block" }}>
          <Text hidden={!transformedData.length} fontSize={"xs"}>
            {relativeHour(new Date(data[Math.floor(data.length / 4)].from))}
          </Text>
        </Box>
        <Text hidden={!transformedData.length} fontSize={"xs"}>
          {relativeHour(new Date(data[Math.floor(data.length / 2)].from))}
        </Text>
        <Box display={{ base: "none", md: "block" }}>
          <Text hidden={!transformedData.length} fontSize={"xs"}>
            {relativeHour(
              new Date(data[Math.floor((3 * data.length) / 4)].from)
            )}
          </Text>
        </Box>
        <Text hidden={!transformedData.length} fontSize={"xs"}>
          {relativeHour(new Date(data[data.length - 1].to))}
        </Text>
      </Stack>
    </Stack>
  );
};
