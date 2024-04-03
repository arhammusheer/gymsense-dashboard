import {
  Box,
  Button,
  Card,
  Grid,
  Heading,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { GiBattery75 } from "react-icons/gi";
import PageHeader from "../components/headers/PageHeader";
import useIot from "../hooks/useIot";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/store";

export default function Home() {
  const { loading, iot, getIots } = useIot();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    getIots();
  }, [token]);

  if (loading) {
    return <Box>Loading...</Box>;
  }
  return (
    <Box p={8}>
      <PageHeader title="Home" subtitle="Welcome to the gym">
        <Account />
      </PageHeader>
      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
        {iot.map((device, index) => (
          <Iot key={index} {...device} />
        ))}
      </Grid>
    </Box>
  );
}

const Account = () => {
  const { isAuthenticated, email } = useAppSelector((state) => state.auth);

  return (
    <Box p={4}>
      <Text>
        {isAuthenticated ? (
          `Hi! ${email}`
        ) : (
          <Button
            colorScheme="blue"
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </Button>
        )}
      </Text>
    </Box>
  );
};

const Iot = ({
  name,
  occupancy,
  id,
  batteryLevel,
}: {
  name?: string;
  occupancy: boolean;
  id: string;
  batteryLevel?: number;
}) => {
  const occ = useColorModeValue("red.200", "green.900");
  const avail = useColorModeValue("green.200", "red.900");

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/iot/${id}`);
  };

  return (
    <Card
      p={4}
      boxShadow="md"
      bg={occupancy ? avail : occ}
      cursor={"pointer"}
      onClick={handleClick}
    >
      <Heading as="h3" size="md" mb={2}>
        {name || id}
      </Heading>
      <Text>Location</Text>
      <Stack direction="row" justify={"space-between"}>
        <Heading as="h4" size="sm">
          {occupancy ? "Available" : "Occupied"}
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
