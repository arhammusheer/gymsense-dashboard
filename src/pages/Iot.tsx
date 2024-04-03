import { Box } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/headers/PageHeader";

export default function Iot() {
  const { id } = useParams();

  return (
    <Box p={8}>
      <PageHeader title={id ? `${id}` : "Device"} />
      <Box>Device ID: {id}</Box>
    </Box>
  );
}
