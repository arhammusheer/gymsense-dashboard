import { Box, Flex, useColorModeValue } from "@chakra-ui/react";

export default function Navbar({ logo }: { logo: React.ReactNode }) {
  const bg = useColorModeValue("white", "gray.900");
  const height = {
    base: 16,
    md: 24,
  };
  return (
    <Box bg={bg} px={4}>
      <Flex h={height} alignItems={"center"} justifyContent={"center"}>
        <Box h={height}>{logo}</Box>
      </Flex>
    </Box>
  );
}
