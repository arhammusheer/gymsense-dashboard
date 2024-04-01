import {
  Box,
  Card,
  Grid,
  Heading,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect } from "react";
import PageHeader from "../components/headers/PageHeader";
import { useAuth } from "../hooks/useAuth";
import useIot from "../hooks/useIot";

export default function Home() {
  const { loading, iot, getIot } = useIot();
  const { token } = useAuth();

  useEffect(() => {
    getIot();
  }, [token]);

  if (loading) {
    return <Box>Loading...</Box>;
  }
  return (
    <Box p={4}>
      <PageHeader title="Home" subtitle="Welcome to the gym" />
      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
        {iot.map((device, index) => (
          <Iot key={index} {...device} />
        ))}
      </Grid>
    </Box>
  );
}

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
  const occ = useColorModeValue("red.100", "green.900");
  const avail = useColorModeValue("green.100", "red.900");

  return (
    <Card p={4} boxShadow="md" bg={occupancy ? occ : avail}>
      <Heading as="h3" size="md" mb={2}>
        {name || id}
      </Heading>
      <Stack direction="row" justify={"space-between"}>
        <Heading as="h4" size="sm">
          {occupancy ? "Available" : "Occupied"}
        </Heading>
        {batteryLevel !== undefined && (
          <Heading as="h4" size="sm">
            {batteryLevel}%
          </Heading>
        )}
      </Stack>
    </Card>
  );
};
