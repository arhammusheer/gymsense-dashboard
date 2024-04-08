import { Box, Button, Heading, Icon, Stack } from "@chakra-ui/react";
import { BiCheck } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/headers/PageHeader";
import { iot } from "../redux/apis/api.slice";

export default function CreateNewIot() {
  const [createIot, { isLoading, isSuccess, data }] = iot.createIot();
  const navigate = useNavigate();

  if (isSuccess && data) {
    // Redirect to the new Iot page
    navigate(`/iot/${data.id}`);
  }
  return (
    <Box p={8}>
      <PageHeader title="New Device" subtitle="Add a new device to the gym" />
      <Stack justify={"center"} direction={"row"} spacing={4}>
        <Button
          aria-label="Create New Iot"
          rightIcon={<Icon as={BiCheck} w={12} h={12} />}
          variant={"solid"}
          colorScheme={"green"}
          height={"80px"}
          rounded={"full"}
          onClick={() => createIot()}
          isLoading={isLoading}
          size={"lg"}
        >
          <Heading size="md">Create New Device</Heading>
        </Button>
      </Stack>
    </Box>
  );
}
