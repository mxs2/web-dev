"use client";

import { FC, PropsWithChildren } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: { heading: "Inter, system-ui", body: "Inter, system-ui" },
  styles: { global: { body: { bg: "gray.50" } } },
});

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};
