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
  Stack,
  StackDivider,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { CgMenu } from "react-icons/cg";
import { GiBattery75 } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/headers/PageHeader";
import { useGetIotsQuery } from "../redux/apis/api.slice";
import { useAppSelector } from "../redux/store";

export default function Home() {
  const { isLoading, data, isSuccess, refetch } = useGetIotsQuery();
  const { token } = useAppSelector((state) => state.auth);
  // Setup refetch on token change
  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [refetch, token]);

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box p={8}>
      <PageHeader title="Home" subtitle="Welcome to the gym">
        <Account />
      </PageHeader>
      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
        {isSuccess &&
          data.map((device, index) => <Iot key={index} {...device} />)}
      </Grid>
    </Box>
  );
}

const Account = () => {
  const { isAuthenticated, email } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const isSM = useBreakpointValue({ base: false, sm: true });

  const {
    isOpen: isSidebarOpen,
    onOpen: onSidebarOpen,
    onClose: onSidebarClose,
  } = useDisclosure();

  const authenticatedActions = {
    logout: { label: "Logout", onClick: () => console.log("Logout") },
  };

  const unauthenticatedActions = {
    login: { label: "Login", onClick: () => navigate("/login") },
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
            <DrawerHeader>Account</DrawerHeader>
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
                      onClick={action.onClick}
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
                      onClick={action.onClick}
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
      </Stack>
    </Card>
  );
};
