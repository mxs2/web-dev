import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          500: { value: "#1A365D" },
          600: { value: "#153E75" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
