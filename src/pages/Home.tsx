import {
  Box,
  Button,
  Card,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Grid,
  Heading,
  Icon,
  IconButton,
  Skeleton,
  Stack,
  StackDivider,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";

import { MouseEvent, useEffect } from "react";
import { BiBell } from "react-icons/bi";
import { CgMenu } from "react-icons/cg";
import { GiBattery75 } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/headers/PageHeader";
import { useGetIotsQuery } from "../redux/apis/api.slice";
import { authActions } from "../redux/slices/auth.slice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { notificationActions } from "../redux/slices/notification.slice";

export default function Home() {
  // Setup refetch on token change

  return (
    <Box p={8}>
      <PageHeader title="Home" subtitle="Welcome to the gym">
        <Account />
      </PageHeader>
      <ListOfIots />
    </Box>
  );
}

const ListOfIots = () => {
  const { isLoading, data, isSuccess, refetch } = useGetIotsQuery();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [refetch, token]);
  return (
    <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
      {isSuccess &&
        data
          .map((device) => <Iot key={device.id} {...device} />)
          .sort((a, b) =>
            (a.props.name || "").localeCompare(b.props.name || "")
          )}
      {isLoading &&
        Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} p={4} boxShadow="md">
            <Skeleton>
              <Heading as="h3" size="md" mb={2}>
                Loading...
              </Heading>
            </Skeleton>
            <Skeleton mt={4}>
              <Text>Loading...</Text>
            </Skeleton>
          </Card>
        ))}
    </Grid>
  );
};

const Account = () => {
  const { isAuthenticated, email } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isSM = useBreakpointValue({ base: false, sm: false });

  const {
    isOpen: isSidebarOpen,
    onOpen: onSidebarOpen,
    onClose: onSidebarClose,
  } = useDisclosure();

  const authenticatedActions = {
    createIot: { label: "New Iot Device", onClick: () => navigate("/iot/new") },
    createHub: { label: "New Hub Device", onClick: () => navigate("/hub/new") },
    logout: { label: "Logout", onClick: () => dispatch(authActions.logout()) },
  };

  const unauthenticatedActions = {
    login: { label: "Login", onClick: () => navigate("/login") },
  };

  const onClickHandler = (action: () => void) => {
    action();
    onSidebarClose();
  };

  const bg = useColorModeValue("white", "black");
  const color = useColorModeValue("black", "white");
  const hoverBg = useColorModeValue("blue.100", "blue.900");

  if (!isSM) {
    return (
      <>
        <IconButton
          colorScheme="blue"
          onClick={onSidebarOpen}
          icon={<Icon as={CgMenu} />}
          aria-label="Open Account Drawer"
        />
        <Drawer
          isOpen={isSidebarOpen}
          placement="right"
          size={"xl"}
          onClose={onSidebarClose}
        >
          <DrawerOverlay />
          <DrawerContent bg={bg}>
            <DrawerCloseButton />
            <DrawerHeader>
              {isAuthenticated ? `Hi! ${email}` : "Account"}
            </DrawerHeader>
            <Stack
              direction="column"
              spacing={4}
              divider={<StackDivider />}
              p={4}
            >
              {isAuthenticated
                ? Object.values(authenticatedActions).map((action, index) => (
                    <Text
                      key={index}
                      onClick={() => onClickHandler(action.onClick)}
                      cursor={"pointer"}
                      _hover={{ bg: hoverBg, color: color }}
                      p={4}
                      rounded={"md"}
                    >
                      {action.label}
                    </Text>
                  ))
                : Object.values(unauthenticatedActions).map((action, index) => (
                    <Text
                      key={index}
                      onClick={() => onClickHandler(action.onClick)}
                      cursor={"pointer"}
                      _hover={{ bg: hoverBg, color: color }}
                      p={4}
                      rounded={"md"}
                    >
                      {action.label}
                    </Text>
                  ))}
            </Stack>
            <DrawerBody></DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <Box p={4}>
      <Text>
        {isAuthenticated ? (
          `Hi! ${email}`
        ) : (
          <Button colorScheme="blue" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </Text>
    </Box>
  );
};

const Iot = ({
  name,
  location,
  occupancy,
  id,
  batteryLevel,
  updatedAt,
  isOffline,
}: {
  name?: string;
  occupancy: boolean;
  location?: string;
  id: string;
  batteryLevel?: number;
  updatedAt?: string;
  isOffline?: boolean;
}) => {
  const occ = useColorModeValue("red.200", "red.900");
  const avail = useColorModeValue("green.200", "green.900");
  const occButton = useColorModeValue("red.300", "red.800");
  const offline = useColorModeValue("gray.200", "gray.900");
  const availButton = useColorModeValue("green.300", "green.800");
  const dispatch = useAppDispatch();

  const notifyWhenAvailable = async (e: MouseEvent) => {
    e.stopPropagation();

    // Request Notification Permission
    dispatch(notificationActions.requestPermission());

    // Notify when available
    dispatch(
      notificationActions.notifyWhenAvailable({
        iotId: id,
      })
    );
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/iot/${id}`);
  };

  return (
    <Card
      p={4}
      boxShadow="md"
      bg={isOffline ? offline : occupancy ? occ : avail}
      cursor={"pointer"}
      onClick={handleClick}
    >
      <Stack direction="row" justify={"space-between"}>
        <Heading as="h3" size="md" mb={2}>
          {name || id}
        </Heading>
        {batteryLevel !== undefined && (
          <Heading as="h4" size="sm">
            <Icon as={GiBattery75} />
            {batteryLevel > 0 && batteryLevel * 100 + "%"}
            {batteryLevel === 0 && "No Battery"}
          </Heading>
        )}
      </Stack>
      <Text>{location || "Unknown"}</Text>
      {updatedAt && <RelativeTime date={updatedAt} />}
      <Stack
        direction="row"
        justify={"space-between"}
        h={"full"}
        align={"flex-end"}
      >
        <Stack direction="row">
          <Heading as="h4" size="sm">
            {isOffline ? "Offline" : occupancy ? "Taken" : "Available"}
          </Heading>
        </Stack>
        {!isOffline && (
          <IconButton
            onClick={notifyWhenAvailable}
            aria-label="Notify When Available"
            icon={<BiBell />}
            // On hover increase the size of the icon
            bg={occupancy ? occ : avail}
            _hover={{ bg: occupancy ? occButton : availButton }}
          />
        )}
      </Stack>
    </Card>
  );
};

// Relative Time
const RelativeTime = ({ date }: { date: string }) => {
  const updatedAt = new Date(date);
  const now = new Date();

  const diff = now.getTime() - updatedAt.getTime();
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return <Text>{rtf.format(-years, "year")}</Text>;
  }

  if (months > 0) {
    return <Text>{rtf.format(-months, "month")}</Text>;
  }

  if (days > 0) {
    return <Text>{rtf.format(-days, "day")}</Text>;
  }

  if (hours > 0) {
    return <Text>{rtf.format(-hours, "hour")}</Text>;
  }

  if (minutes > 0) {
    return <Text>{rtf.format(-minutes, "minute")}</Text>;
  }

  return <Text>{rtf.format(-seconds, "second")}</Text>;
};
