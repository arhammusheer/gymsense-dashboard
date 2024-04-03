import { Heading, Skeleton, Spacer, Stack, Text } from "@chakra-ui/react";
import React from "react";

export default function PageHeader({
  title,
  subtitle,
  isLoading,
  children,
}: {
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Stack direction={"row"} justify={"space-between"} py={8}>
      <Stack spacing={2} justify={"center"}>
        <LoadingHeading title={title} isLoading={isLoading || false} />
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

const LoadingHeading = ({
  title,
  isLoading,
}: {
  title: string;
  isLoading: boolean;
}) => {
  return (
    <Skeleton isLoaded={!isLoading} rounded={"xl"}>
      <Heading as="h1" size="2xl">
        {title}
      </Heading>
    </Skeleton>
  );
};
