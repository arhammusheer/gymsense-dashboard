import { Box, Flex } from "@chakra-ui/react";

export default function Navbar({ logo }: { logo: React.ReactNode }) {
  const height = {
    base: 12,
    md: 16,
  };
  return (
    <Box p={4}>
      <Flex h={height} alignItems={"center"}>
        <Box h={height}>{logo}</Box>
      </Flex>
    </Box>
  );
}
