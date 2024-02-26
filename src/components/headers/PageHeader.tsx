import { Heading, Stack, Text } from "@chakra-ui/react";

export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <Stack spacing={2} mb={4} justify={"center"} px={4} py={8}>
      <Heading as="h1" size="2xl">
        {title}
      </Heading>
      {subtitle && (
        <Text as="h2" fontSize="lg">
          {subtitle}
        </Text>
      )}
    </Stack>
  );
}
