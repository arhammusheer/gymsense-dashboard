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
import { CgMenu } from "react-icons/cg";
import { GiBattery75 } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/headers/PageHeader";
import { useGetIotsQuery } from "../redux/apis/api.slice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { authActions } from "../redux/slices/auth.slice";
import { notificationActions, requestNotificationPermission } from "../redux/slices/notification.slice";
import { BiBell } from "react-icons/bi";

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
        data.map((device, index) => <Iot key={index} {...device} />)}
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
}: {
  name?: string;
  occupancy: boolean;
  location?: string;
  id: string;
  batteryLevel?: number;
}) => {
  const occ = useColorModeValue("red.200", "red.900");
  const avail = useColorModeValue("green.200", "green.900");
  const occButton = useColorModeValue("red.300", "red.800");
  const availButton = useColorModeValue("green.300", "green.800");
  const dispatch = useAppDispatch();

  const notifyWhenAvailable = async (e: MouseEvent) => {
    e.stopPropagation();
    // Request Notification Permission
   await Notification.requestPermission()
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
      bg={occupancy ? occ : avail}
      cursor={"pointer"}
      onClick={handleClick}
    >
      <Heading as="h3" size="md" mb={2}>
        {name || id}
      </Heading>
      <Text>{location || "Unknown"}</Text>
      <Stack direction="row" justify={"space-between"}>
        <Heading as="h4" size="sm">
          {occupancy ? "Taken" : "Available"}
        </Heading>
        {batteryLevel !== undefined && (
          <Heading as="h4" size="sm">
            <Icon as={GiBattery75} />
            {batteryLevel}%
          </Heading>
        )}
        <IconButton
          onClick={notifyWhenAvailable}
          aria-label="Notify When Available"
          icon={<BiBell />}
          // On hover increase the size of the icon
          bg={occupancy ? occ: avail}
          _hover={{ bg: occupancy ? occButton : availButton }}
          
        />
      </Stack>
    </Card>
  );
};
