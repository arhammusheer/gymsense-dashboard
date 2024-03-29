import {
  Box,
  Card,
  Grid,
  Heading,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import Bike from "../assets/bike.svg";
import Treadmill from "../assets/treadmill.svg";
import PageHeader from "../components/headers/PageHeader";

const devices = [
  {
    name: "Bike 0",
    type: "Bike",
    occupied: false,
  },
  {
    name: "Bike 1",
    type: "Bike",
    occupied: true,
  },
  {
    name: "Bike 2",
    type: "Bike",
    occupied: false,
  },
  {
    name: "Bike 3",
    type: "Bike",
    occupied: false,
  },
  {
    name: "Bike 4",
    type: "Bike",
    occupied: false,
  },
  {
    name: "Treadmill 0",
    type: "Treadmill",
    occupied: false,
  },
  {
    name: "Treadmill 1",
    type: "Treadmill",
    occupied: false,
  },
  {
    name: "Treadmill 2",
    type: "Treadmill",
    occupied: false,
  },
  {
    name: "Treadmill 3",
    type: "Treadmill",
    occupied: false,
  },
  {
    name: "Treadmill 4",
    type: "Treadmill",
    occupied: true,
  },
];

export default function Home() {
  return (
    <Box p={4}>
      <PageHeader title="Home" subtitle="Welcome to the gym" />
      <Grid templateColumns="repeat(5, 1fr)" gap={6}>
        {devices.map((device, index) => (
          <Iot key={index} {...device} />
        ))}
      </Grid>
    </Box>
  );
}

const Iot = ({
  name,
  type,
  occupied,
}: {
  name: string;
  type: string;
  occupied: boolean;
}) => {
  const occ = useColorModeValue("red.100", "green.900");
  const avail = useColorModeValue("green.100", "red.900");

  if (type !== "Bike" && type !== "Treadmill") {
    return null;
  }
  return (
    <Card p={4} boxShadow="md" bg={occupied ? avail : occ}>
      <Heading as="h3" size="md" mb={2}>
        {name}
      </Heading>
      <Image
        src={type === "Bike" ? Bike : Treadmill}
        alt={type}
        width={50}
        height={50}
      />
    </Card>
  );
};
