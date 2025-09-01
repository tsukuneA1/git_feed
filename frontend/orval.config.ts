import type { Config } from "orval";

const config: Config = {
  "api-client": {
    input: "../schema/openapi.bundle.yaml",
    output: {
      target: "./src/lib/api/generated.ts",
      client: "react-query",
      override: {
        mutator: {
          path: "./src/lib/api/mutator.ts",
          name: "customInstance",
        },
        header: false,
      },
      headers: false,
    },
  },
};

export default config;
