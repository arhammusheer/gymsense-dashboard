import { Heading, Spacer, Stack, Text } from "@chakra-ui/react";
import React from "react";

export default function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <Stack direction={"row"} justify={"space-between"} px={4} py={8}>
      <Stack spacing={2} justify={"center"}>
        <Heading as="h1" size="2xl">
          {title}
        </Heading>
        {subtitle && (
          <Text as="h2" fontSize="lg">
            {subtitle}
          </Text>
        )}
      </Stack>
      <Spacer />
      {children}
    </Stack>
  );
}
