import { Box, Heading, Text } from "@chakra-ui/react";

type ClientesPageHeaderProps = {
  title: string;
  description: string;
};

export function ClientesPageHeader({
  title,
  description,
}: ClientesPageHeaderProps) {
  return (
    <Box>
      <Heading size="lg">{title}</Heading>
      <Text mt={2} color="gray.600">
        {description}
      </Text>
    </Box>
  );
}