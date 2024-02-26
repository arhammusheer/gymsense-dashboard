import { Flex } from "@chakra-ui/react";

export default function FullCenter({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      h="100%"
      w="100%"
    >
      {children}
    </Flex>
  );
}
